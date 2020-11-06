export interface DiningRule {
  id: number;
  name: string;
  fee: number;
  rule1: number;
  rule2: number;
  createdBy: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt?: Date;
}
