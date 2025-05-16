import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const balanceRouter = createTRPCRouter({
  /* uploadBalance: publicProcedure
      .input(
        z.object({
          companyId: z.number(),
          year: z.number(),
          pdf: z.string(), // Base64 do PDF
        })
      )
      .mutation(async ({ input }) => {
        const { companyId, year, pdf } = input;
        const key = `balances/${companyId}_${year}.pdf`;
  
        // Enviar PDF para o S3
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: key,
            Body: Buffer.from(pdf, "base64"),
            ContentType: "application/pdf",
          })
        );
  
        // Salvar metadados no banco
        const balance = await prisma.balance.create({
          data: {
            companyId,
            year,
            s3Url: `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
          },
        });
  
        return { balanceId: balance.id, s3Url: balance.s3Url };
      }),*/

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
