import 'server-only';
import { callAI } from '../call';
import { withFallback } from '../degraded';

export interface WelcomeMessageInput {
  userName: string;
  locale: 'vi' | 'en';
  userId: string | null;
}

const SYSTEM_PROMPT = `You are a friendly AI assistant welcoming a new user to a platform.

Guidelines:
- Be warm but professional
- Keep response under 50 words
- Use user's name if provided
- Match the requested locale (Vietnamese or English)
- Don't ask questions — just welcome
- Don't mention you're AI

Output format: plain text greeting message only, no formatting, no preamble.`;

function templateFallback(input: WelcomeMessageInput): string {
  if (input.locale === 'vi') {
    return `Chào mừng bạn, ${input.userName}!`;
  }
  return `Welcome, ${input.userName}!`;
}

/**
 * Generate personalized welcome message via AI with template fallback.
 *
 * Use case: welcome_message_v1
 * Model: Auto-selected (Sonnet by default for personalization)
 */
export async function generateWelcomeMessage(input: WelcomeMessageInput): Promise<string> {
  return withFallback(
    async () => {
      const result = await callAI({
        useCase: 'welcome_message_v1',
        systemPrompt: SYSTEM_PROMPT,
        userMessage: `User name: ${input.userName}\nLocale: ${input.locale}\n\nGenerate a welcoming greeting.`,
        userId: input.userId,
      });
      return result.text.trim();
    },
    () => templateFallback(input),
  );
}
