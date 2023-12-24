import { parse } from 'csv-parse';
import fs from 'node:fs'

const filePath = new URL('../streams/tasks.csv', import.meta.url);

const fileStream = fs.createReadStream(filePath, 'utf8');

const csvParser = parse({ 
  fromLine: 2 
});

async function execute() {
  const parser = fileStream.pipe(csvParser)

  for await (const record of parser) {
      const [title, description] = record

      await fetch('http://localhost:3333/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
        })
      })
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

execute();
