import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { config } from "dotenv";
import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function extractFileInfo(fileName: string) {
  const info = {
    companyId: null as number | null,
    year: null as number | null,
    period: null as string | null,
    cnpj: null as string | null,
  };
  
  try {
    const yearMatch = fileName.match(/(\d{4})/g);
    if (yearMatch && yearMatch.length > 0) {
      const years = yearMatch.map(y => parseInt(y)).filter(y => y >= 1900 && y <= 2100);
      if (years.length > 0) {
        info.year = Math.max(...years);
      }
    }
    
    const cnpjMatch = fileName.match(/(\d{14})/);
    if (cnpjMatch) {
      info.companyId = parseInt(cnpjMatch[0].slice(-6));
      info.cnpj = cnpjMatch[0];
    }

    if (fileName.includes('BP') || fileName.includes('Balanço_Patrimonial')) {
      info.period = 'Anual';
    } else if (fileName.includes('Q1')) {
      info.period = 'Q1';
    } else if (fileName.includes('Q2')) {
      info.period = 'Q2';
    } else if (fileName.includes('Q3')) {
      info.period = 'Q3';
    } else if (fileName.includes('Q4')) {
      info.period = 'Q4';
    }
    
  } catch (error) {
    console.log("Erro ao extrair informações:", error);
  }
  
  return info;
}

async function uploadBalances() {
  try {
    console.log("🚀 Iniciando upload de balanços...");

    if (!process.env.S3_BUCKET) {
      throw new Error("S3_BUCKET não configurado");
    }

    const balancesPath = join(process.cwd(), "balances");

    const files = await readdir(balancesPath);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
    
    if (pdfFiles.length === 0) {
      console.log("❌ Nenhum arquivo PDF encontrado na pasta balances");
      return;
    }
    
    console.log(`📁 Encontrados ${pdfFiles.length} arquivos PDF`);
    
    let successCount = 0;
    let errorCount = 0;

    for (const fileName of pdfFiles) {
      try {
        console.log(`📤 Processando: ${fileName}`);

        const filePath = join(balancesPath, fileName);
        const fileBuffer = await readFile(filePath);

        const fileInfo = extractFileInfo(fileName);
        const companyId = fileInfo.companyId || 1;
        const year = fileInfo.year || new Date().getFullYear();
        const period = fileInfo.period || 'Anual';
        
        const company = await searchCompanyName(fileInfo.cnpj);
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const key = `balances/${company}/${year}/${period}.pdf`;

        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: key,
            Body: fileBuffer,
            ContentType: "application/pdf",
            Metadata: {
              companyId: companyId.toString(),
              year: year.toString(),
              period: period,
              originalFileName: fileName.replace(/[^a-zA-Z0-9.-]/g, '_'),
              uploadedAt: new Date().toISOString(),
              fileSize: fileBuffer.length.toString(),
            },
          })
        );
        
        const s3Url = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        
        console.log(`✅ Enviado: ${fileName}`);
        console.log(`   Empresa: ${company} | Ano: ${year} | Período: ${period}`);
        console.log(`   S3 Key: ${key}`);
        console.log(`   URL: ${s3Url}`);
        console.log(`   Tamanho: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB`);
        console.log("");
        
        successCount++;
        
      } catch (error) {
        console.error(`❌ Erro ao processar ${fileName}:`, error);
        errorCount++;
      }
    }
    
    console.log("📊 Resumo do upload:");
    console.log(`   ✅ Sucessos: ${successCount}`);
    console.log(`   ❌ Erros: ${errorCount}`);
    console.log(`   📁 Total: ${pdfFiles.length}`);
    
    if (successCount > 0) {
      console.log("🎉 Upload concluído com sucesso!");
    } else {
      console.log("💥 Nenhum arquivo foi enviado com sucesso");
    }
    
  } catch (error) {
    console.error("💥 Erro fatal:", error);
    process.exit(1);
  }
}

async function searchCompanyName(cnpj: string | null): Promise<string> {
  if (!cnpj) {
    console.log('⚠️ CNPJ não fornecido para busca de nome da empresa');
    return 'Nome não encontrado';
  }

  try {
    console.log(`🔍 Buscando nome da empresa para CNPJ: ${cnpj}`);
    
    const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!response.ok) {
      console.error(`❌ Erro na requisição para ReceitaWS:`, {
        cnpj,
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status === 'ERROR') {
      console.error(`❌ Erro retornado pela API ReceitaWS:`, {
        cnpj,
        message: data.message,
        fullResponse: data
      });
      return `CNPJ: ${cnpj}`;
    }

    if (data.nome) {
      console.log(`✅ Nome encontrado para CNPJ ${cnpj}: ${data.nome}`);
      return data.nome;
    } else {
      console.warn(`⚠️ Nome não encontrado na resposta da API para CNPJ ${cnpj}:`, data);
      return `CNPJ: ${cnpj}`;
    }

  } catch (error) {
    console.error(`❌ Erro detalhado ao buscar nome da empresa:`, {
      cnpj,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    return `CNPJ: ${cnpj}`;
  }
}

uploadBalances();