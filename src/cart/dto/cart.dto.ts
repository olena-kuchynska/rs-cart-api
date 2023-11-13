import { ApiProperty } from '@nestjs/swagger';
import { CartItem } from '../models';

export class CartDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  items: CartItem[];
}
