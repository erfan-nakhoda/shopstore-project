namespace NodeJS {
    interface ProcessEnv {
        PORT : number,
        PROJECT_TYPE : "development" | "production"
        CORS_ORIGIN_URL : string
        SEED_ADMIN_PHONE : string
        //db
        DB_HOST: string,
        DB_URL: string,
        DB_USER: string,
        DB_PASS: string,
        DB_PORT: number,
        DB_NAME: string,
        //REDIS
        REDIS_URL : string
        //tokens
        ACCESS_TOKEN_SECRET : string
        REFRESH_TOKEN_SECRET : string
        JWT_SECRET : string
        ACCESS_TOKEN_TTL : number
        REFRESH_TOKEN_TTL : number

        //COOKIE
        COOKIE_SECRET : string,
        REFRESH_TOKEN_COOKIE_TTL : number
    }
}