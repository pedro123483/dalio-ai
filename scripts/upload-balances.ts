#!/usr/bin/env tsx

/**
 * Script para fazer upload de todos os PDFs da pasta balances para o S3
 * 
 * Uso:
 * npm run upload-balances
 * ou
 * npx tsx scripts/upload-balances.ts
 */

import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { config } from "dotenv";
import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

// Carregar variáveis de ambiente
config();

// Configurar cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Função para extrair informações do nome do arquivo
function extractFileInfo(fileName: string) {
  const info = {
    companyId: null as number | null,
    year: null as number | null,
    period: null as string | null,
    cnpj: null as string | null,
  };
  
  try {
    // Extrair ano - procurar por padrão de data (31-12-2024)
    const yearMatch = fileName.match(/(\d{4})/g);
    if (yearMatch && yearMatch.length > 0) {
      // Pegar o último ano encontrado (provavelmente o mais recente)
      const years = yearMatch.map(y => parseInt(y)).filter(y => y >= 1900 && y <= 2100);
      if (years.length > 0) {
        info.year = Math.max(...years); // Pegar o ano mais recente
      }
    }
    
    // Extrair CNPJ/ID da empresa
    const cnpjMatch = fileName.match(/(\d{14})/);
    if (cnpjMatch) {
      info.companyId = parseInt(cnpjMatch[0].slice(-6));
      info.cnpj = cnpjMatch[0];
    }
    
    // Identificar período
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
    
    // Verificar variáveis de ambiente
    if (!process.env.S3_BUCKET) {
      throw new Error("S3_BUCKET não configurado");
    }
    
    // Caminho para a pasta balances
    const balancesPath = join(process.cwd(), "balances");
    
    // Ler arquivos da pasta
    const files = await readdir(balancesPath);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
    
    if (pdfFiles.length === 0) {
      console.log("❌ Nenhum arquivo PDF encontrado na pasta balances");
      return;
    }
    
    console.log(`📁 Encontrados ${pdfFiles.length} arquivos PDF`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Processar cada arquivo
    for (const fileName of pdfFiles) {
      try {
        console.log(`📤 Processando: ${fileName}`);
        
        // Ler arquivo
        const filePath = join(balancesPath, fileName);
        const fileBuffer = await readFile(filePath);
        
        // Extrair informações
        const fileInfo = extractFileInfo(fileName);
        const companyId = fileInfo.companyId || 1;
        const year = fileInfo.year || new Date().getFullYear();
        const period = fileInfo.period || 'Anual';
        
        // Usar "empresa XPTO" como nome da empresa e formato esperado pelo frontend
        const company = fileInfo.cnpj ? `CNPJ: ${fileInfo.cnpj}` : "empresa XPTO";
        const key = `balances/${company}/${year}/${period}.pdf`;
        
        // Upload para S3
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
    
    // Resumo final
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

// Executar se chamado diretamente
uploadBalances();