import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRegEvent } from "./user_regEvent.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @Column({ unique: true, length: 50 })
    email: string;

    @Column({ select: false, length: 100 })
    password: string;

    @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
    role: String;

    @OneToMany(() => UserRegEvent, userRegEvent => userRegEvent.user)
    userRegEvents: UserRegEvent[];
}