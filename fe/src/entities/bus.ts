export type Bus = {
  id: number;
  name: string;
  line_id: number;
  line_name?: string | null;
};

export type CreateBusPayload = {
  name: string;
  line_id: number;
};

export type UpdateBusPayload = {
  name?: string;
  line_id?: number;
};
