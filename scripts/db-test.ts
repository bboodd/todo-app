import { AppDataSource } from "@/lib/db/data-source";

const main = async () => {
  await AppDataSource.initialize();
  console.log("DB 연결 성공");
  process.exit(0);
};

main();
