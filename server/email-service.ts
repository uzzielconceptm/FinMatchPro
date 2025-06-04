import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

export const sendFreeTrialConfirmation = async (email: string, firstName: string, userType: string) => {
  try {
    await transporter.verify();
    
    const msg = {
      from: `"FinMatch Service" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Welcome to FinMatch Service - Your Free Trial is Starting!',
      text: `Thanks for starting your free trial! This confirms your ${userType} mode access.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #15765C; font-size: 28px; margin: 0;">FinMatch Service</h1>
            <p style="color: #666; margin: 5px 0;">AI-Powered Bookkeeping Service</p>
          </div>
          
          <h2 style="color: #333;">Welcome to your free trial${firstName ? `, ${firstName}` : ''}!</h2>
          
          <p style="color: #555; line-height: 1.6;">
            Thank you for signing up for FinMatch Service. Your 30-day free trial for <strong>${userType} Mode</strong> is now active!
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #15765C; margin-top: 0;">What's included in your trial:</h3>
            <ul style="color: #555; line-height: 1.6;">
              <li>Email receipt extraction (Gmail & Outlook)</li>
              <li>Bank transaction sync via Plaid</li>
              <li>AI-powered receipt matching</li>
              <li>Tax-ready categorization</li>
              <li>Export to CSV or TurboTax format</li>
              <li>Email support during trial</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #15765C; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Get Started with Setup
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.5;">
            We'll send you setup instructions within 24 hours. If you have any questions, reply to this email or contact our support team.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 FinMatch Service. All rights reserved.<br>
            This email was sent to confirm your free trial signup.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(msg);
    console.log('Free trial confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send free trial confirmation email:', error);
    throw new Error(`Failed to send confirmation email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const sendSubscriptionConfirmation = async (
  email: string, 
  firstName: string, 
  userType: string, 
  planType: string
) => {
  try {
    await transporter.verify();
    
    const pricing = userType === 'solo' 
      ? { monthly: '$29', annual: '$290' }
      : { monthly: '$89', annual: '$890' };
    
    const selectedPrice = planType === 'monthly' ? pricing.monthly : pricing.annual;
    
    const msg = {
      from: `"FinMatch Service" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Welcome to FinMatch Early Access Program!',
      text: `Welcome to the FinMatch Early Access Program! You're on our priority waitlist for ${userType} mode.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #15765C; font-size: 28px; margin: 0;">FinMatch Service</h1>
            <p style="color: #666; margin: 5px 0;">AI-Powered Bookkeeping Service</p>
            <div style="background-color: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 20px; display: inline-block; font-size: 14px; font-weight: bold;">
              ⭐ Early Access Program
            </div>
          </div>
          
          <h2 style="color: #333;">You're on the waitlist${firstName ? `, ${firstName}` : ''}!</h2>
          
          <p style="color: #555; line-height: 1.6;">
            Thank you for your interest in FinMatch Service Early Access Program. You've been added to our priority waitlist for <strong>${userType} Mode</strong> with <strong>${planType} billing</strong> at <strong>${selectedPrice}</strong>.
          </p>
          
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1d4ed8; margin-top: 0;">Early Access Benefits:</h3>
            <ul style="color: #555; line-height: 1.6;">
              <li>50% off regular pricing for first 6 months</li>
              <li>Priority customer support</li>
              <li>Direct feedback line to our product team</li>
              <li>Exclusive webinars and training sessions</li>
              <li>Advanced features before general release</li>
              <li>Free migration assistance from current tools</li>
            </ul>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #15765C; margin-top: 0;">What happens next?</h3>
            <ol style="color: #555; line-height: 1.6;">
              <li>We'll contact you within 48 hours with next steps</li>
              <li>You'll receive early access details and setup instructions</li>
              <li>Our team will help you migrate from your current tools</li>
              <li>You'll get exclusive training on advanced features</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #15765C; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Join Our Community
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.5;">
            We're excited to have you as an early adopter! If you have any questions, reply to this email or contact our team directly.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 FinMatch Service. All rights reserved.<br>
            This email was sent to confirm your early access signup.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(msg);
    console.log('Subscription confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send subscription confirmation email:', error);
    throw new Error(`Failed to send confirmation email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const sendAdminNotification = async (
  signupType: 'trial' | 'subscription',
  userData: any
) => {
  try {
    await transporter.verify();
    
    const { firstName, lastName, email, userType, company, planType } = userData;
    const fullName = `${firstName} ${lastName}`;
    
    const subject = signupType === 'trial' 
      ? `New Free Trial Signup - ${fullName}`
      : `New Subscription Signup - ${fullName}`;
    
    const signupDetails = signupType === 'trial'
      ? `
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Signup Type:</td><td style="padding: 8px; border: 1px solid #ddd;">Free Trial</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">User Mode:</td><td style="padding: 8px; border: 1px solid #ddd;">${userType} Mode</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Monthly Expenses:</td><td style="padding: 8px; border: 1px solid #ddd;">${userData.monthlyExpenses || 'Not specified'}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Current Tool:</td><td style="padding: 8px; border: 1px solid #ddd;">${userData.currentTool || 'Not specified'}</td></tr>
      `
      : `
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Signup Type:</td><td style="padding: 8px; border: 1px solid #ddd;">Early Access Subscription</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">User Mode:</td><td style="padding: 8px; border: 1px solid #ddd;">${userType} Mode</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Billing:</td><td style="padding: 8px; border: 1px solid #ddd;">${planType}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Client Count:</td><td style="padding: 8px; border: 1px solid #ddd;">${userData.clientCount || 'Not specified'}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Referral Source:</td><td style="padding: 8px; border: 1px solid #ddd;">${userData.referralSource || 'Not specified'}</td></tr>
      `;
    
    const msg = {
      from: `"FinMatch Service" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Send to admin email
      subject: subject,
      text: `New ${signupType} signup from ${fullName} (${email})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #15765C; font-size: 28px; margin: 0;">FinMatch Service</h1>
            <p style="color: #666; margin: 5px 0;">Admin Notification</p>
          </div>
          
          <div style="background-color: ${signupType === 'trial' ? '#dbeafe' : '#fef3c7'}; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
            <h2 style="color: ${signupType === 'trial' ? '#1d4ed8' : '#92400e'}; margin: 0;">
              ${signupType === 'trial' ? 'New Free Trial Signup' : 'New Subscription Signup'}
            </h2>
          </div>
          
          <h3 style="color: #333; margin-bottom: 15px;">User Details:</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name:</td><td style="padding: 8px; border: 1px solid #ddd;">${fullName}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td><td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${email}" style="color: #15765C;">${email}</a></td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Company:</td><td style="padding: 8px; border: 1px solid #ddd;">${company || 'Not specified'}</td></tr>
            ${signupDetails}
            <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Signup Time:</td><td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td></tr>
          </table>
          
          ${signupType === 'trial' 
            ? `
              <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #0369a1; margin-top: 0;">Free Trial Actions Required:</h4>
                <ul style="color: #555; margin: 0;">
                  <li>Send setup instructions within 24 hours</li>
                  <li>Schedule onboarding call if needed</li>
                  <li>Monitor trial usage and engagement</li>
                </ul>
              </div>
            `
            : `
              <div style="background-color: #fefce8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #a16207; margin-top: 0;">Early Access Actions Required:</h4>
                <ul style="color: #555; margin: 0;">
                  <li>Contact within 48 hours for next steps</li>
                  <li>Provide early access details and timeline</li>
                  <li>Schedule product demo and migration assistance</li>
                  <li>Add to priority customer list</li>
                </ul>
              </div>
            `
          }
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${email}" style="background-color: #15765C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Contact User
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated admin notification from FinMatch Service.<br>
            Generated on ${new Date().toLocaleString()}
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(msg);
    console.log('Admin notification email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send admin notification email:', error);
    // Don't throw error here as this shouldn't break the user signup flow
    return null;
  }
};