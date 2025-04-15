import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
//import { prisma } from "~/server/db";

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
    .input(z.object({ balanceId: z.number() }))
    .query(async ({ input }) => {
      /*const balance = await prisma.balance.findUnique({
        where: { id: input.balanceId },
      });*/

      //if (!balance) throw new Error("Balance not found");

      //const key = `balances/${balance.companyId}_${balance.year}.pdf`;
      const key = `balanco-btg-3t24.pdf`;

      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
      });

      // Adicionar configurações especiais para a URL pré-assinada
      const signedUrlOptions = {
        expiresIn: 3600,
        // Adicionar cabeçalhos que resolvem problemas de CORS
      };

      const url = await getSignedUrl(s3Client, command, signedUrlOptions);

      console.log(url);

      return { url };
    }),
});
