export const prerender = false;

import type { APIRoute } from 'astro';
import { addContactToResend, sendWelcomeEmail, checkContactExists } from '@/lib/resend/client';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

/**
 * Route API pour s'inscrire à la newsletter
 * Ajoute l'email à Resend
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Validation
    const validated = subscribeSchema.parse(body);
    
    // Vérifier si le contact existe déjà
    const alreadyExists = await checkContactExists(validated.email);
    
    if (alreadyExists) {
      // L'utilisateur est déjà inscrit, on retourne un message approprié
      return new Response(
        JSON.stringify({ 
          success: true,
          alreadySubscribed: true,
          message: 'You are already subscribed to our newsletter' 
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Ajouter à Resend (ajout direct, pas de confirmation)
    const result = await addContactToResend(validated.email);
    
    if (!result.success) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: result.error || 'Failed to subscribe' 
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Si le contact existait déjà (cas de double vérification), ne pas envoyer l'email
    if (result.alreadyExists) {
      return new Response(
        JSON.stringify({ 
          success: true,
          alreadySubscribed: true,
          message: 'You are already subscribed to our newsletter' 
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Envoyer l'email de bienvenue uniquement pour les nouveaux inscrits (en arrière-plan, ne bloque pas la réponse)
    sendWelcomeEmail(validated.email).catch((error) => {
      console.error('Failed to send welcome email:', error);
      // On ne fait pas échouer l'inscription si l'email échoue
    });
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Successfully subscribed to newsletter' 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Validation error',
          details: error.errors 
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    console.error('Newsletter subscription error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        details: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
