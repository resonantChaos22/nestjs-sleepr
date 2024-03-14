import { CreateChargeDto } from '@app/common';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  constructor(private readonly configService: ConfigService) {}

  private readonly stripe = new Stripe(
    this.configService.get<string>('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2023-10-16',
    },
  );

  async createCharge({ amount }: CreateChargeDto) {
    try {
      // const paymentMethod = await this.stripe.paymentMethods.create({
      //   type: 'card',
      //   card,
      // });  //  Not advisable to pass in card details from server. To enable this, we need to ask permission from the support team.

      const paymentIntent = await this.stripe.paymentIntents.create({
        payment_method: 'pm_card_visa',
        amount: amount * 100,
        confirm: true,
        payment_method_types: ['card'],
        currency: 'inr',
      });
      return paymentIntent;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(err);
    }
  }
}
