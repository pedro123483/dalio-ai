import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Função auxiliar para extrair informações do nome do arquivo
function extractFileInfo(fileName: string) {
  // Exemplo: "Balanço_Patrimonial_(BP)_17896365000149_01-01-2024_31-12-2024.pdf"
  const info = {
    companyId: null as number | null,
    year: null as number | null,
    period: null as string | null,
  };
  
  try {
    // Tentar extrair ano da data no nome do arquivo
    const yearMatch = fileName.match(/(\d{4})/g);
    if (yearMatch && yearMatch.length > 0) {
      info.year = parseInt(yearMatch[0]);
    }
    
    // Tentar extrair CNPJ/ID da empresa
    const cnpjMatch = fileName.match(/(\d{14})/);
    if (cnpjMatch) {
      // Usar os últimos 6 dígitos do CNPJ como companyId
      info.companyId = parseInt(cnpjMatch[0].slice(-6));
    }
    
    // Tentar identificar período
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
    console.log("Erro ao extrair informações do nome do arquivo:", error);
  }
  
  return info;
}

export const balanceRouter = createTRPCRouter({
  uploadBalance: publicProcedure
    .input(
      z.object({
        companyId: z.number(),
        year: z.number(),
        period: z.string().optional(),
        pdf: z.string(), // Base64 do PDF
        fileName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { companyId, year, period, pdf, fileName } = input;
      
      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const periodSuffix = period ? `_${period}` : '';
      const key = `balances/${companyId}_${year}${periodSuffix}_${timestamp}.pdf`;

      try {
        // Enviar PDF para o S3
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: key,
            Body: Buffer.from(pdf, "base64"),
            ContentType: "application/pdf",
            Metadata: {
              companyId: companyId.toString(),
              year: year.toString(),
              period: period || '',
              originalFileName: fileName || '',
              uploadedAt: new Date().toISOString(),
            },
          })
        );

        // Construir URL do S3
        const s3Url = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        // Por enquanto, não salvamos no banco pois a tabela Balance não existe
        // TODO: Criar tabela Balance no schema do Prisma se necessário

        return { 
          success: true,
          balanceId: null, 
          s3Url,
          key,
          message: "PDF enviado com sucesso para o S3"
        };
      } catch (error) {
        console.error("Erro ao enviar PDF para S3:", error);
        throw new Error("Falha ao enviar PDF para o S3");
      }
    }),

  uploadBalanceFile: publicProcedure
    .input(
      z.object({
        companyId: z.number(),
        year: z.number(),
        period: z.string().optional(),
        fileData: z.string(), // Base64 do arquivo
        fileName: z.string(),
        fileType: z.string().default("application/pdf"),
      })
    )
    .mutation(async ({ input }) => {
      const { companyId, year, period, fileData, fileName, fileType } = input;
      
      // Validar se é um PDF
      if (!fileType.includes("pdf")) {
        throw new Error("Apenas arquivos PDF são aceitos");
      }
      
      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const periodSuffix = period ? `_${period}` : '';
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const key = `balances/${companyId}_${year}${periodSuffix}_${sanitizedFileName}_${timestamp}.pdf`;

      try {
        // Enviar arquivo para o S3
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: key,
            Body: Buffer.from(fileData, "base64"),
            ContentType: fileType,
            ContentDisposition: `attachment; filename="${sanitizedFileName}"`,
            Metadata: {
              companyId: companyId.toString(),
              year: year.toString(),
              period: period || '',
              originalFileName: fileName,
              uploadedAt: new Date().toISOString(),
              fileSize: Buffer.from(fileData, "base64").length.toString(),
            },
          })
        );

        // Construir URL do S3
        const s3Url = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        return { 
          success: true,
          s3Url,
          key,
          fileName: sanitizedFileName,
          fileSize: Buffer.from(fileData, "base64").length,
          message: "Arquivo enviado com sucesso para o S3"
        };
      } catch (error) {
        console.error("Erro ao enviar arquivo para S3:", error);
        throw new Error("Falha ao enviar arquivo para o S3");
      }
    }),

  uploadLocalBalances: publicProcedure
    .input(
      z.object({
        companyId: z.number().optional(),
        year: z.number().optional(),
        period: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { companyId, year, period } = input;
      
      try {
        // Caminho para a pasta balances
        const balancesPath = join(process.cwd(), "balances");
        
        // Ler todos os arquivos da pasta
        const files = await readdir(balancesPath);
        
        // Filtrar apenas arquivos PDF
        const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
        
        if (pdfFiles.length === 0) {
          return {
            success: false,
            message: "Nenhum arquivo PDF encontrado na pasta balances",
            uploadedFiles: [],
            errors: []
          };
        }

        console.log(`📁 Encontrados ${pdfFiles.length} arquivos PDF`);
        
        const uploadedFiles = [];
        const errors = [];

        for (const fileName of pdfFiles) {
          try {
            console.log(`📤 Processando: ${fileName}`);
            
            // Ler o arquivo
            const filePath = join(balancesPath, fileName);
            const fileBuffer = await readFile(filePath);
            
            // Extrair informações do nome do arquivo
            const fileInfo = extractFileInfo(fileName);
            
            // Usar valores fornecidos ou extraídos
            const finalCompanyId = companyId || fileInfo.companyId || 1;
            const finalYear = year || fileInfo.year || new Date().getFullYear();
            const finalPeriod = period || fileInfo.period || 'Anual';
            
            // Gerar chave para o S3
            const timestamp = Date.now();
            const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
            const key = `balances/${finalCompanyId}_${finalYear}_${finalPeriod}_${sanitizedFileName}_${timestamp}.pdf`;
            
            // Enviar para o S3
            await s3Client.send(
              new PutObjectCommand({
                Bucket: process.env.S3_BUCKET!,
                Key: key,
                Body: fileBuffer,
                ContentType: "application/pdf",
                Metadata: {
                  companyId: finalCompanyId.toString(),
                  year: finalYear.toString(),
                  period: finalPeriod,
                  originalFileName: fileName,
                  uploadedAt: new Date().toISOString(),
                  fileSize: fileBuffer.length.toString(),
                },
              })
            );
            
            const s3Url = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
            
            uploadedFiles.push({
              fileName,
              s3Url,
              key,
              fileSize: fileBuffer.length,
              companyId: finalCompanyId,
              year: finalYear,
              period: finalPeriod,
            });
            
            console.log(`✅ Enviado: ${fileName}`);
            
          } catch (error) {
            console.error(`❌ Erro ao processar ${fileName}:`, error);
            errors.push({
              fileName,
              error: error instanceof Error ? error.message : "Erro desconhecido"
            });
          }
        }

        return {
          success: true,
          message: `${uploadedFiles.length} arquivos enviados, ${errors.length} erros`,
          uploadedFiles,
          errors,
          totalFiles: pdfFiles.length,
          successfulUploads: uploadedFiles.length,
          failedUploads: errors.length
        };
        
      } catch (error) {
        console.error("Erro ao processar pasta balances:", error);
        throw new Error("Falha ao processar arquivos da pasta balances");
      }
    }),

  getBalanceUrl: publicProcedure
    .input(
      z.object({
        company: z.string(),
        year: z.string(),
        period: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { company, year, period } = input;
      const key = `balances/${company}/${year}/${period}.pdf`;

      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: key,
      });

      const signedUrlOptions = {
        expiresIn: 3600,
      };

      const url = await getSignedUrl(s3Client, command, signedUrlOptions);
      return { url };
    }),

  listCompanies: publicProcedure.query(async () => {
    // Listar todos os prefixos (empresas) na pasta balances/
    const command = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET!,
      Prefix: "balances/",
      Delimiter: "/",
    });

    const response = await s3Client.send(command);

    // Extrair nomes das empresas dos prefixos
    const companies =
      response.CommonPrefixes?.map((prefix) => {
        const name = prefix.Prefix?.replace("balances/", "").replace("/", "");
        return { name };
      }) || [];

    return companies;
  }),

  listAvailableYears: publicProcedure
    .input(z.object({ company: z.string() }))
    .query(async ({ input }) => {
      const { company } = input;

      const command = new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET!,
        Prefix: `balances/${company}/`,
        Delimiter: "/",
      });

      const response = await s3Client.send(command);

      const years =
        response.CommonPrefixes?.map((prefix) => {
          const year = prefix.Prefix?.replace(
            `balances/${company}/`,
            "",
          ).replace("/", "");
          return year;
        }).filter(Boolean) || [];

      return years;
    }),

  listAvailablePeriods: publicProcedure
    .input(
      z.object({
        company: z.string(),
        year: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { company, year } = input;

      const command = new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET!,
        Prefix: `balances/${company}/${year}/`,
      });

      const response = await s3Client.send(command);

      const periods =
        response.Contents?.map((item) => {
          const key = item.Key;
          if (!key) return null;

          // Extrair o nome do período do caminho do arquivo
          const filename = key.split("/").pop();
          if (!filename) return null;

          // Remover a extensão .pdf
          const period = filename.replace(".pdf", "");
          return period;
        }).filter(Boolean) || [];

      return periods;
    }),
});
