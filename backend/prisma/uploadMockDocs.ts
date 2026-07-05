import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  // Cek apakah script ini dijalankan dari folder 'dist'
  const isRunningFromDist = __dirname.includes(path.join('dist', 'prisma')) || __dirname.endsWith(path.join('dist', 'prisma'));

  const AppModulePath = isRunningFromDist ? '../app.module.js' : '../dist/app.module.js';
  const RagServicePath = isRunningFromDist ? '../modules/rag/rag.service.js' : '../dist/modules/rag/rag.service.js';
  const PrismaServicePath = isRunningFromDist ? '../core/database/prisma.service.js' : '../dist/core/database/prisma.service.js';

  const { AppModule } = await import(AppModulePath);
  const { RagService } = await import(RagServicePath);
  const { PrismaService } = await import(PrismaServicePath);

  const app = await NestFactory.createApplicationContext(AppModule);
  const ragService = app.get(RagService);
  const prisma = app.get(PrismaService);

  const mockDataDir = path.join(__dirname, '../mockData');
  const files = fs.readdirSync(mockDataDir);

  const uploadedIds: string[] = [];

  for (const filename of files) {
    if (filename === 'Direktori Karyawan.json') {
      console.log(`Skipping ${filename} as it is seeded in the database employees table.`);
      continue;
    }

    const filePath = path.join(mockDataDir, filename);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      console.log(`Uploading mock document: ${filename}`);
      const fileBuffer = fs.readFileSync(filePath);
      
      const fileMock: any = {
        originalname: filename,
        buffer: fileBuffer,
        size: stat.size,
        mimetype: filename.endsWith('.json') ? 'application/json' : filename.endsWith('.csv') ? 'text/csv' : 'text/plain',
      };

      const result = await ragService.uploadDocument(fileMock);
      uploadedIds.push(result.documentId);
      console.log(`Uploaded ${filename} successfully. ID: ${result.documentId}`);
    }
  }

  console.log('Waiting for background document processing to complete...');
  let activeCount = 1;
  while (activeCount > 0) {
    const docs = await prisma.document.findMany({
      where: {
        id: { in: uploadedIds },
        status: { in: ['PENDING', 'PROCESSING'] },
      },
    });
    activeCount = docs.length;
    if (activeCount > 0) {
      console.log(`Still processing ${activeCount} documents. Waiting 2 seconds...`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  const finalDocs = await prisma.document.findMany({
    where: { id: { in: uploadedIds } },
  });
  console.log('--- Processing Summary ---');
  for (const doc of finalDocs) {
    console.log(`- ${doc.name}: ${doc.status}`);
  }

  await app.close();
  console.log('Script execution finished.');
}

bootstrap().catch(console.error);
