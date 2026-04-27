import { Section } from "@/components/Section";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const items = [
  {
    q: "how do i actually talk to koa?",
    a: "you text a number in iMessage like you would a friend. no app to download, no login screen, no onboarding flow.",
  },
  {
    q: "is this just chatgpt in a text?",
    a: "no. koa remembers you across conversations, takes real actions (reminders, logs, sends), and talks like a homie — not an assistant.",
  },
  {
    q: "what about my privacy?",
    a: "your conversations are encrypted and only used to help you. we don't sell data, train public models on your chats, or share anything with advertisers.",
  },
  {
    q: "can koa really hold me accountable?",
    a: "yeah. it remembers what you said you'd do and checks in. if you're slacking it'll call you out — gently or directly, whichever you need.",
  },
  {
    q: "what if i want to cancel?",
    a: "one text. no retention dance, no 14-click settings menu. you're out.",
  },
  {
    q: "is koa a therapist or advisor?",
    a: "no. koa is a friend with sharp instincts. for medical, legal, or financial advice, talk to a licensed professional.",
  },
];

export const FAQ = () => (
  <Section id="faq" className="px-6 py-24 sm:py-32">
    <div className="mx-auto max-w-2xl">
      <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        questions
      </h2>
      <Accordion type="single" collapsible className="mt-12 w-full">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-border/70">
            <AccordionTrigger className="py-5 text-left text-[17px] font-medium text-foreground hover:no-underline">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="pb-5 text-[15px] leading-relaxed text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </Section>
);
