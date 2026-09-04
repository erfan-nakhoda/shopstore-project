import { PrimaryGeneratedColumn } from "typeorm";

export class AbstractEntity {
    @PrimaryGeneratedColumn("increment")
    id : number
}