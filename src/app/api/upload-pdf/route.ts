// src/app/api/upload-pdf/route.ts
import { NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return Response.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }
    
    // Gerar chave única para o S3
    const fileName = file.name.replace(/\s+/g, '-').toLowerCase();
    const timestamp = Date.now();
    const key = `uploads/${timestamp}-${fileName}`;
    
    // Converter o arquivo para ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Fazer upload para o S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: key,
        Body: Buffer.from(arrayBuffer),
        ContentType: "application/pdf",
      })
    );
    
    // Retornar a chave do arquivo para uso posterior
    return Response.json({ 
      success: true, 
      key,
      fileId: timestamp // ID único para referência do arquivo
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    return Response.json({ error: "Falha ao processar o upload" }, { status: 500 });
  }
}