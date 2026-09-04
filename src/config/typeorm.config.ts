import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export function TypeOrmConfig(): TypeOrmModuleOptions {
    const { PROJECT_TYPE, DB_URL } = process.env
    return {
        type: "postgres",
        url: DB_URL,
        synchronize: PROJECT_TYPE === "development",
        autoLoadEntities: false,
        entities: [
            'dist/modules/**/**/*.entity{.ts,.js}',
            'dist/modules/**/**/**/*.entity{.ts,.js}',
        ]

    }
}