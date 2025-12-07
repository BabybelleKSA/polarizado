import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { calculatePrice } from '@/lib/pricing';

const leads = [];
const validCars = ['Sedan', 'Coupe', 'SUV', 'Truck'];
const validPercents = [5, 20, 35, 50];

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body?.name?.trim();
    const phone = body?.phone?.trim();
    const preferredTime = body?.preferredTime?.trim() || '';
    const contactMethod = body?.contactMethod || 'Either';
    const carType = body?.carType;
    const tintPercent = Number(body?.tintPercent);
    const incomingPrice = Number(body?.price);

    const errors = [];
    if (!name) errors.push('Name is required.');
    if (!phone) errors.push('Phone is required.');
    const digitsOnly = phone ? phone.replace(/[^\d+]/g, '') : '';
    if (phone && !/^(\+?\d{7,15})$/.test(digitsOnly)) {
      errors.push('Phone number is invalid.');
    }
    if (!validCars.includes(carType)) errors.push('Car type is invalid.');
    if (!validPercents.includes(tintPercent)) errors.push('Tint percentage is invalid.');

    if (errors.length) {
      return NextResponse.json({ success: false, message: 'Validation failed.', errors }, { status: 400 });
    }

    const price = Number.isFinite(incomingPrice) ? incomingPrice : calculatePrice(carType, tintPercent);

    const lead = {
      name,
      phone,
      preferredTime,
      contactMethod,
      carType,
      tintPercent,
      price,
      createdAt: new Date().toISOString()
    };

    leads.unshift(lead);
    if (leads.length > 50) {
      leads.pop();
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const toCustomer = process.env.EMAIL_TO_CUSTOMER;
    const toTechnician = process.env.EMAIL_TO_TECHNICIAN;

    let delivered = false;

    if (resendApiKey && toCustomer && toTechnician) {
      const resend = new Resend(resendApiKey);
      await Promise.all([
        resend.emails.send({
          from: 'Diaz Polarizado <notifications@yourdomain.com>',
          to: toCustomer,
          subject: 'Thank you for your tint request!',
          text: 'Diaz Polarizado will contact you soon to schedule your tint.'
        }),
        resend.emails.send({
          from: 'Diaz Polarizado <notifications@yourdomain.com>',
          to: toTechnician,
          subject: 'New Tint Lead!',
          text: `New customer request:\nName: ${name}\nPhone: ${phone}\nCar Type: ${carType}\nTint: ${tintPercent}%\nPreferred Time: ${preferredTime || 'n/a'}\nContact: ${contactMethod}`
        })
      ]);
      delivered = true;
    } else {
      // Mock notification for local development without Resend keys.
      // eslint-disable-next-line no-console
      console.log('Mock notifications', {
        customerMessage: 'Diaz Polarizado will contact you soon to schedule your tint.',
        technicianMessage: `New customer request:\nName: ${name}\nPhone: ${phone}\nCar Type: ${carType}\nTint: ${tintPercent}%\nPreferred Time: ${preferredTime || 'n/a'}\nContact: ${contactMethod}`
      });
    }

    return NextResponse.json({
      success: true,
      delivered,
      message: 'Lead received. We will reach out shortly.',
      lead
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error handling lead', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.', errors: [] },
      { status: 500 }
    );
  }
}
