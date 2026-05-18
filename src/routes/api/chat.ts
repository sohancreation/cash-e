import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createAiGatewayProvider } from "@/lib/ai-gateway";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { messages } = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(messages)) return new Response("messages required", { status: 400 });

        const key = process.env.AI_API_KEY || process.env.LOVABLE_API_KEY;
        let model;

        if (key) {
          const gateway = createAiGatewayProvider(key);
          model = gateway("google/gemini-3-flash-preview");
        } else {
          console.warn("AI_API_KEY is not configured. Falling back to CASh-E AI interactive smart simulation.");
          const userMessage = messages[messages.length - 1]?.content || "";
          
          let responseText = "";
          const query = userMessage.toLowerCase();
          
          // Robust stem-matching to handle Bengali keyboard Unicode normalization differences (e.g., U+09DF vs U+09AF+U+09BC)
          const isSanchay = query.includes("সঞ্চ") || query.includes("জম") || query.includes("sanch") || query.includes("save") || query.includes("১০০০") || query.includes("1000");
          const isStudent = query.includes("stud") || query.includes("stip") || query.includes("বাজেট") || query.includes("বাজে") || query.includes("স্টাই");
          const isEid = query.includes("eid") || query.includes("ঈদ") || query.includes("উৎস");
          const isKhamar = query.includes("khamar") || query.includes("poult") || query.includes("loan") || query.includes("খামার") || query.includes("লোন") || query.includes("কৃষি");
          const isBill = query.includes("bill") || query.includes("pay") || query.includes("বিদ্যুৎ") || query.includes("বিল");

          if (isSanchay) {
            responseText = `### ৳১০০০ মাসিক সঞ্চয় করার সহজ উপায় 🎯\n\nপ্রতি মাসে ৳১০০০ সঞ্চয় করা একটি দারুণ সিদ্ধান্ত! নিচে কিছু কার্যকর টিপস দেওয়া হলো:\n\n*   **CASh-E Sanchay স্কিম ব্যবহার করুন:** আমাদের অ্যাপের **Sanchay (Savings)** অপশনে গিয়ে একটি লক্ষ্যভিত্তিক সঞ্চয় স্কিম চালু করুন। প্রতি সপ্তাহে ৳২৫০ বা প্রতিদিন ৳৩৪ স্বয়ংক্রিয়ভাবে জমা হবে।\n*   **বাজেট ট্র্যাকিং (৫০-৩০-২০ নিয়ম):** আপনার প্রয়োজনীয় খরচ মিটিয়ে বাকি অংশ সরাসরি সেভিংস একাউন্টে পাঠিয়ে দিন।\n*   **মোবাইল রিচার্জ ও অফার সাশ্রয়:** অপ্রয়োজনীয় টকটাইম বা ইন্টারনেট প্যাকেজ বাদ দিয়ে **CASh-E Bundles** থেকে ডিসকাউন্ট ডিল নিন।\n*   **মাইক্রো-সঞ্চয়:** প্রতিবার লেনদেনের সময় রাউন্ড-আপ ফিচার দিয়ে খুচরা টাকা সঞ্চয় করুন।\n\n*“বিন্দু বিন্দু বালুকণা, গড়ে তোলে মহাদেশ!”* আজই আপনার প্রথম **৳১০০০ Sanchay Target** সেট করুন! 🚀`;
          } else if (isStudent) {
            responseText = `### Student Stipend Budgeting Guide 📚🎓\n\nManaging a student stipend can be tricky, but CASh-E is here to make it super simple!\n\n*   **The 50/30/20 Rule for Students:**\n    *   **৫০% (প্রয়োজন):** পড়াশোনার খরচ, বইপত্র, ও যাতায়াত।\n    *   **৩০% (ইচ্ছা):** বন্ধুদের সাথে আড্ডা বা হালকা বিনোদন।\n    *   **২০% (সঞ্চয়):** জরুরি ফান্ড বা ভবিষ্যতের জন্য সঞ্চয়।\n*   **Activate Student Mode:** CASh-E অ্যাপের **Student Mode** চালু করুন। এতে আপনি পাবেন বিশেষ ক্যাশব্যাক, কম খরচে সেন্ড মানি, এবং স্টুডেন্ট ডিসকাউন্ট।\n*   **CASh-E Bazaar Deals:** Use the Bazaar tab to find student-friendly food & study deals to save extra cash.\n*   **Set a Small Sanchay Goal:** Start with just ৳১০০/month. Consistency is key!\n\nNeed help setting up your first budget goal? Just let me know! 💡`;
          } else if (isEid) {
            responseText = `### ঈদ সঞ্চয় লক্ষ্য (Eid Sanchay Goal) 🌙✨\n\nঈদের আনন্দকে আরও বাড়িয়ে তুলতে আগে থেকে সঞ্চয় করা একটি অসাধারণ আইডিয়া!\n\n*   **প্রতিদিন ৳৫০ সঞ্চয়:** প্রতিদিন মাত্র ৳৫০ সঞ্চয় করলে ৩ মাসে আপনার **৳৪,৫০০** জমে যাবে, যা দিয়ে ঈদের কেনাকাটা অনায়াসে করা সম্ভব!\n*   **Auto-Deposit চালু করুন:** CASh-E Sanchay-তে গিয়ে 'Eid Savings' লক্ষ্য তৈরি করুন এবং আপনার সাপ্তাহিক অটো-ডেবিট চালু করুন।\n*   **CASh-E Bazaar Eid Discounts:** ঈদের সময় বাজার থেকে কেনাকাটায় বিশেষ ক্যাশব্যাক এবং ডিসকাউন্ট কুপন ব্যবহার করুন।\n*   **উৎসব বোনাস সঞ্চয়:** যেকোনো উপহার বা অতিরিক্ত আয় সরাসরি আপনার ঈদ তহবিলে জমা করুন।\n\nআসুন আজই আপনার **Eid Savings Goal** চালু করি! ৳৫০০ দিয়ে শুরু করতে চান? 🎉`;
          } else if (isKhamar) {
            responseText = `### CASh-E Khamar (Agri-Finance) & Poultry Tips 🐔🌾\n\nখামার বা পোল্ট্রি ব্যবসার জন্য লোন নেওয়া একটি লাভজনক উদ্যোগ হতে পারে যদি সঠিকভাবে পরিকল্পনা করা হয়।\n\n*   **পোল্ট্রি খামার শুরুর আগে করণীয়:**\n    1.  **স্থান নির্বাচন:** শুষ্ক, বায়ু চলাচলকারী এবং বন্যামুক্ত জায়গা নির্বাচন করুন।\n    2.  **প্রশিক্ষণ:** পোল্ট্রি পালনের বেসিক রোগবালাই ও খাদ্য ব্যবস্থাপনা সম্পর্কে জানুন।\n*   **CASh-E Khamar Loan:** আমরা কৃষকদের জন্য খুব সহজ শর্তে ও স্বল্প সুদে **Agri-Loans** প্রদান করে থাকি। অ্যাপের **Khamar** ট্যাব থেকে আবেদন করতে পারবেন।\n*   **বীমা (Bima) সুবিধা:** দুর্যোগ বা মহামারীতে মুরগি মারা গেলে লোকসান এড়াতে আমাদের **Poultry Insurance (খামার বীমা)** গ্রহণ করুন।\n*   **বাজার সংযোগ:** আপনার উৎপাদিত পণ্য সরাসরি বিক্রির জন্য আমাদের অংশীদারদের সহায়তা নিন।\n\nআপনি কি প্রথমবার পোল্ট্রি খামার শুরু করতে যাচ্ছেন, নাকি বিদ্যমান ব্যবসা বড় করতে চান? আমাকে জানান, আমি সঠিক লোনের অঙ্ক নির্ধারণে সাহায্য করব! 🚜`;
          } else if (isBill) {
            responseText = `### CASh-E Bill Pay & PostPay ⚡💸\n\nCASh-E অ্যাপ ব্যবহার করে বিদ্যুৎ, পানি, গ্যাস ও ইন্টারনেট বিল দেওয়া এখন চোখের পলকে সম্ভব!\n\n*   **No-Fee Bill Pay:** কোনো অতিরিক্ত চার্জ ছাড়াই আপনার প্রথম ৩টি বিদ্যুৎ বা ইন্টারনেট বিল পরিশোধ করুন।\n*   **Autopay চালু করুন:** প্রতি মাসের বিলের ডেট মনে রাখার ঝামেলা এড়াতে **Autopay** চালু করুন। বিলের শেষ সময়ে স্বয়ংক্রিয়ভাবে পরিশোধ হয়ে যাবে।\n*   **PostPay (Buy Now, Pay Later):** পকেটে টাকা না থাকলেও চিন্তা নেই! **CASh-E PostPay** ব্যবহার করে বিল পরিশোধ করুন এবং পরে সুবিধাজনক সময়ে শোধ করুন।\n\nআপনার বিদ্যুৎ বিলের প্রোভাইডার সিলেক্ট করুন এবং সরাসরি বিল পে করতে অ্যাপের **Bills** মেনুতে যান। কোনো প্রশ্ন থাকলে বলুন! 🔌`;
          } else {
            responseText = `### CASh-E AI সহকারী তে আপনাকে স্বাগতম! 🤝\n\nআমি আপনার আর্থিক বন্ধু (Financial Bondhu)। আপনাকে কীভাবে সাহায্য করতে পারি?\n\n*   **Sanchay (Savings):** ছোট লক্ষ্য নিয়ে সঞ্চয় শুরু করুন।\n*   **Khamar (Agri-Finance):** কৃষি লোন এবং শস্য বীমা সম্পর্কে জানুন।\n*   **Student Mode:** শিক্ষার্থীদের জন্য বিশেষ বাজেট এবং ডিসকাউন্ট।\n*   **Bazaar & Bundles:** কম খরচে খাবার, শপিং এবং ওটিটি সাবক্রিপশন।\n*   **Send Money & Bill Pay:** কোনো চার্জ ছাড়াই টাকা পাঠানো এবং বিল দেওয়া।\n\nআপনার যেকোনো প্রশ্ন বাংলা অথবা ইংরেজিতে করতে পারেন। আমি উত্তর দিতে প্রস্তুত! 💡`;
          }

          model = {
            specificationVersion: "v3" as const,
            provider: "custom-mock",
            modelId: "bilingual-financial-coach",
            defaultObjectGenerationMode: undefined,
            async doGenerate() {
              throw new Error("doGenerate is not implemented. Use doStream instead.");
            },
            async doStream() {
              const stream = new ReadableStream({
                async start(controller) {
                  // Initialize the text chunk stream part in V3
                  controller.enqueue({
                    type: "text-start" as const,
                    id: "0",
                  });

                  const words = responseText.split(/(\s+)/);
                  for (const word of words) {
                    if (word) {
                      controller.enqueue({
                        type: "text-delta" as const,
                        id: "0",
                        delta: word,
                      });
                    }
                    await new Promise((resolve) => setTimeout(resolve, 15));
                  }

                  // Terminate the text stream part in V3
                  controller.enqueue({
                    type: "text-end" as const,
                    id: "0",
                  });

                  // Finish the stream
                  controller.enqueue({
                    type: "finish" as const,
                    finishReason: "stop" as const,
                    usage: { inputTokens: 0, outputTokens: 0 },
                  });
                  controller.close();
                },
              });

              return {
                stream,
                rawCall: { rawPrompt: null, rawSettings: {} },
                request: {},
                response: {},
              };
            },
          };
        }

        const result = streamText({
          model,
          system:
            "You are CASh-E AI — a friendly bilingual (Bangla + English) financial coach inside the CASh-E Amar Desh super-app for Bangladesh. Help users with budgeting, savings (Sanchay), sending money, paying bills, agri-finance (Khamar), student tips, and lifestyle bundles. Use ৳ for Taka, mix natural Bangla when the user writes Bangla, keep replies short, friendly, and concrete with bullet points when listing tips. Never invent fees. Stay in scope of personal finance and the CASh-E app.",
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
