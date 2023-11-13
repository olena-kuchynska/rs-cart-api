import { CartStatus } from '../../enums/carts';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './users.entity';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  cartId: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'json', nullable: false })
  payment: {
    type: string;
    address?: any;
    creditCard?: any;
  };

  @Column({ type: 'json', nullable: false })
  delivery: {
    type: string;
    address: any;
  };

  @Column({ type: 'text' })
  comments: string;

  @Column({ type: 'enum', enum: CartStatus })
  status: CartStatus;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: false })
  total: number;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
}
