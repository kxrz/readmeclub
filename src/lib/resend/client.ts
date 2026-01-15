import { Resend } from 'resend';

/**
 * Client Resend pour l'envoi d'emails
 * 
 * Nécessite la variable d'environnement RESEND_API_KEY
 */
export function getResendClient(): Resend {
  const apiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  
  return new Resend(apiKey);
}

/**
 * Vérifie si un contact existe déjà dans Resend
 * 
 * @param email Email du contact à vérifier
 * @returns true si le contact existe, false sinon
 */
export async function checkContactExists(email: string): Promise<boolean> {
  try {
    const resend = getResendClient();
    const { data, error } = await resend.contacts.get({ email });
    
    // Si data existe et pas d'erreur, le contact est trouvé
    if (data && !error) {
      return true;
    }
    
    // Si erreur, vérifier si c'est une erreur 404 (contact non trouvé)
    if (error) {
      // Resend peut retourner différentes structures d'erreur
      // Vérifier le statusCode ou le message d'erreur
      const statusCode = (error as any)?.statusCode;
      const message = (error as any)?.message?.toLowerCase() || '';
      
      if (statusCode === 404 || message.includes('not found') || message.includes('does not exist')) {
        return false;
      }
      
      // Pour les autres erreurs (permissions, réseau, etc.), on log et on considère que le contact n'existe pas
      // pour éviter les faux positifs qui empêcheraient l'ajout
      console.warn('Error checking contact existence:', error);
      return false;
    }
    
    // Pas de data ni d'error, le contact n'existe probablement pas
    return false;
  } catch (error: any) {
    // En cas d'exception, on considère que le contact n'existe pas pour éviter les faux positifs
    // qui empêcheraient l'ajout d'un nouveau contact
    console.warn('Failed to check contact existence:', error);
    return false;
  }
}

// ID de l'audience principale dans Resend (segment "General")
const RESEND_AUDIENCE_ID = 'c36e8121-6252-465c-acd5-27ad7f1941bc';

/**
 * Ajoute un contact à Resend dans l'audience "General"
 * 
 * @param email Email du contact
 * @param audienceId ID de l'audience Resend (utilise l'audience "General" par défaut)
 * @returns { success: boolean; alreadyExists?: boolean; error?: string }
 */
export async function addContactToResend(
  email: string,
  audienceId: string = RESEND_AUDIENCE_ID
): Promise<{ success: boolean; alreadyExists?: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    
    // Créer le contact dans l'audience spécifiée
    const { data, error } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });
    
    if (error) {
      // Si le contact existe déjà, Resend peut retourner une erreur spécifique
      // On vérifie aussi via le code d'erreur ou le message
      if (error.message?.toLowerCase().includes('already exists') || 
          error.message?.toLowerCase().includes('duplicate') ||
          error.statusCode === 422) {
        return { success: true, alreadyExists: true };
      }
      
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }
    
    console.log(`[Resend] Contact ${email} added to audience ${audienceId}`);
    return { success: true, alreadyExists: false };
  } catch (error: any) {
    console.error('Failed to add contact to Resend:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

/**
 * Fonction utilitaire pour retry avec backoff exponentiel
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Si c'est la dernière tentative, on échoue
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Calculer le délai avec backoff exponentiel (1000ms, 2000ms, 4000ms)
      const delay = initialDelay * Math.pow(2, attempt);
      
      // Ne retry que pour les erreurs réseau/timeout
      const isNetworkError = 
        error?.message?.includes('fetch') ||
        error?.message?.includes('timeout') ||
        error?.message?.includes('Unable to fetch') ||
        error?.message?.includes('could not be resolved') ||
        error?.name === 'application_error' ||
        !error?.statusCode;
      
      if (isNetworkError) {
        console.warn(`[Resend] Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // Pour les autres erreurs (validation, auth, etc.), on ne retry pas
        throw error;
      }
    }
  }
  
  throw lastError;
}

/**
 * Envoie un email de bienvenue après inscription à la newsletter
 * 
 * @param email Email du destinataire
 */
export async function sendWelcomeEmail(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier que la clé API est configurée
    const apiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
    if (!apiKey) {
      const errorMsg = 'RESEND_API_KEY environment variable is not set';
      console.error(`[Resend] ${errorMsg}`);
      return { success: false, error: errorMsg };
    }
    
    const resend = getResendClient();
    
    // Template HTML websafe pour l'email de bienvenue
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Welcome to readme.club Newsletter</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 20px 20px 20px; background-color: #ffffff; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: #1a1a1a; line-height: 1.2;">
                Welcome to readme.club! 🎉
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 30px 40px; background-color: #ffffff;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Thank you for subscribing to our newsletter! We're excited to have you as part of the Xteink community.
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                We hope you'll find valuable information, resources, and updates that help you make the most of your Xteink device and stay connected with our growing community.
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                We'd love to hear from you! Your feedback, suggestions, and contributions make readme.club better for everyone. Feel free to:
              </p>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0;">
                <tr>
                  <td style="padding: 0 0 12px 0;">
                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                      • Share your thoughts and feedback about the site
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 0 12px 0;">
                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                      • Submit resources, tools, or wallpapers you've created
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 0 12px 0;">
                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                      • Share your ideas and wishes for both the site and your tablet
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                You can contribute by visiting <a href="https://readme.club/contribute" style="color: #000000; text-decoration: underline;">readme.club/contribute</a> or joining the discussion on <a href="https://www.reddit.com/r/xteinkereader" style="color: #000000; text-decoration: underline;">Reddit</a>.
              </p>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding: 0 40px 30px 40px; background-color: #ffffff;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="background-color: #000000; border-radius: 6px;">
                    <a href="https://readme.club" style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px;">
                      Visit readme.club
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #6b7280;">
                You're receiving this email because you subscribed to the readme.club newsletter.
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Bottom spacing -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="padding: 20px 0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                readme.club - Xteink Community Hub
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // Version texte brut pour les clients email qui ne supportent pas HTML
    const textContent = `Welcome to readme.club! 🎉

Thank you for subscribing to our newsletter! We're excited to have you as part of the Xteink community.

We hope you'll find valuable information, resources, and updates that help you make the most of your Xteink device and stay connected with our growing community.

We'd love to hear from you! Your feedback, suggestions, and contributions make readme.club better for everyone. Feel free to:

• Share your thoughts and feedback about the site
• Submit resources, tools, or wallpapers you've created
• Share your ideas and wishes for both the site and your tablet

You can contribute by visiting https://readme.club/contribute or joining the discussion on https://www.reddit.com/r/xteinkereader

Visit readme.club: https://readme.club

---
You're receiving this email because you subscribed to the readme.club newsletter.
Manage preferences: https://readme.club/newsletter

readme.club - Xteink Community Hub`;

    // Utiliser retry avec backoff pour les erreurs réseau
    let data: any;
    let error: any;
    
    try {
      const result = await retryWithBackoff(
        async () => {
          const sendResult = await resend.emails.send({
            from: 'florent@hey.readme.club',
            to: email,
            subject: 'Welcome to readme.club Newsletter! 🎉',
            html: htmlContent,
            text: textContent,
          });
          
          // Si on a une erreur réseau, on laisse retryWithBackoff la gérer
          if (sendResult.error) {
            const errorObj = sendResult.error as any;
            const isNetworkError = 
              errorObj?.message?.includes('Unable to fetch') ||
              errorObj?.message?.includes('could not be resolved') ||
              errorObj?.message?.includes('fetch') ||
              errorObj?.message?.includes('timeout') ||
              errorObj?.name === 'application_error' ||
              errorObj?.statusCode === null ||
              !errorObj?.statusCode;
            
            if (isNetworkError) {
              console.warn(`[Resend] Network error detected, will retry:`, {
                message: errorObj?.message,
                name: errorObj?.name,
                statusCode: errorObj?.statusCode,
              });
              throw errorObj;
            }
          }
          
          return sendResult;
        },
        3, // 3 retries max
        1000 // Délai initial de 1 seconde
      );
      
      data = result.data;
      error = result.error;
    } catch (retryError: any) {
      // Si toutes les tentatives ont échoué, on traite comme une erreur réseau
      error = retryError;
      console.error(`[Resend] All retry attempts failed for ${email}:`, {
        message: retryError?.message,
        name: retryError?.name,
        statusCode: retryError?.statusCode,
      });
    }
    
    if (error) {
      console.error(`[Resend] Email send error for ${email}:`, {
        message: error.message,
        statusCode: (error as any)?.statusCode,
        name: (error as any)?.name,
        error: error,
      });
      return { success: false, error: error.message || 'Unknown error' };
    }
    
    if (!data || !data.id) {
      console.warn(`[Resend] Email sent but no data.id returned for ${email}`);
      return { success: false, error: 'No email ID returned from Resend' };
    }
    
    console.log(`[Resend] Welcome email sent successfully to ${email}, ID: ${data.id}`);
    return { success: true };
  } catch (error: any) {
    console.error(`[Resend] Exception sending welcome email to ${email}:`, {
      message: error.message,
      stack: error.stack,
      error: error,
      name: error?.name,
      statusCode: error?.statusCode,
    });
    return { success: false, error: error.message || 'Unknown error' };
  }
}
