class CreateTransactionDto {
  transaction_id: string;

  provider_id: number;

  customer_id: string;

  amount: number;

  first_name: string;

  last_name: string;

  email: string | undefined;

  action_type: string;

  provisioning_method: string | undefined;

  product_name: string | undefined;

  bundle_id: string | undefined;

  method_name: string | undefined;

  reference_id: string | undefined;

  cashback_percentage: number;

  continue_success_url: string | undefined;

  return_deeplink: string | undefined;
}

export default CreateTransactionDto;
