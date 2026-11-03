import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useSearchParams } from "react-router-dom";

import {
  createConversation,
  getMessages,
  Message,
  sendMessage,
} from "../services/api";

type UiMessage = {
  id: string;
  sender_type: string;
  content: string;
};

type EnquiryType =
  | "buy"
  | "sell"
  | "build"
  | "invest"
  | "general";

const GENERAL_WELCOME =
  "Hi! I'm the MAYVEE Property Assistant. Whether you're looking to buy, sell, build or invest in property, I'll help understand your requirements and guide you to the right next step.";

const GENERAL_SUGGESTIONS = [
  "I want to buy a property.",
  "I want to sell a property.",
  "I want to build or develop a property.",
  "I'm looking for an investment opportunity.",
];

const BUY_SUGGESTIONS = [
  "I'm looking for a house.",
  "I'm looking for an apartment.",
  "I'm looking for land.",
  "I'm interested in an investment property.",
];

const SELL_SUGGESTIONS = [
  "I want to sell a house.",
  "I want to sell an apartment.",
  "I want to sell land.",
  "I want to sell a commercial property.",
];

const BUILD_SUGGESTIONS = [
  "I already own the land.",
  "I still need land for the project.",
  "I want to build a family home.",
  "I want to develop apartments.",
];

const INVEST_SUGGESTIONS = [
  "I'm interested in land investment.",
  "I'm interested in rental property.",
  "I'm interested in apartments.",
  "I'm open to suitable investment opportunities.",
];

function getEnquiryType(
  intent: string | null
): EnquiryType {
  switch (intent) {
    case "buy":
      return "buy";

    case "sell":
      return "sell";

    case "build":
      return "build";

    case "invest":
      return "invest";

    default:
      return "general";
  }
}

function getWelcomeMessage(
  enquiryType: EnquiryType,
  property: string | null,
  location: string | null,
  price: string | null
) {
  if (property) {
    let propertyDetails = property;

    if (location) {
      propertyDetails += ` in ${location}`;
    }

    if (price) {
      propertyDetails += ` listed at ${price}`;
    }

    return `You're enquiring about the ${propertyDetails}. I can help capture your interest and the information MAYVEE needs before following up with you.`;
  }

  switch (enquiryType) {
    case "buy":
      return "Welcome to MAYVEE's buying enquiry. I'll help capture the kind of property you're looking for, your preferred location, budget and timeline.";

    case "sell":
      return "Welcome to MAYVEE's selling enquiry. I'll help capture what you're selling, where the property is located, your asking price and other important details.";

    case "build":
      return "Welcome to MAYVEE's build and development enquiry. I'll help understand your land, proposed project, preferred location, budget and development goals.";

    case "invest":
      return "Welcome to MAYVEE's property investment enquiry. I'll help understand your budget, preferred location and the kind of opportunity you're interested in.";

    default:
      return GENERAL_WELCOME;
  }
}

function getPrefilledMessage(
  enquiryType: EnquiryType,
  property: string | null,
  location: string | null,
  price: string | null
) {
  if (property) {
    let message = `I'm interested in the ${property}`;

    if (location) {
      message += ` in ${location}`;
    }

    if (price) {
      message += ` listed at ${price}`;
    }

    message +=
      ". I'd like more information about this property.";

    return message;
  }

  switch (enquiryType) {
    case "sell":
      return "I have a property I would like to sell through MAYVEE Homes & Properties.";

    case "build":
      return "I have a property development or building project I would like to discuss with MAYVEE Homes & Properties.";

    case "buy":
      return "I'm looking to buy a property and would like help finding suitable options.";

    case "invest":
      return "I'm interested in property investment opportunities and would like to discuss suitable options.";

    default:
      return "";
  }
}

function getSuggestions(
  enquiryType: EnquiryType
) {
  switch (enquiryType) {
    case "buy":
      return BUY_SUGGESTIONS;

    case "sell":
      return SELL_SUGGESTIONS;

    case "build":
      return BUILD_SUGGESTIONS;

    case "invest":
      return INVEST_SUGGESTIONS;

    default:
      return GENERAL_SUGGESTIONS;
  }
}

function getGuidanceText(
  enquiryType: EnquiryType
) {
  switch (enquiryType) {
    case "buy":
      return "Useful details: property type, preferred location, bedrooms, budget and when you hope to buy.";

    case "sell":
      return "Useful details: property type, location, asking price, property condition and how soon you want to sell.";

    case "build":
      return "Useful details: whether you own the land, location, project type, approximate budget and desired timeline.";

    case "invest":
      return "Useful details: investment budget, preferred location, property type and your investment goal.";

    default:
      return "Tell MAYVEE what you want to achieve and I'll help organise the important details.";
  }
}

function getPlaceholder(
  enquiryType: EnquiryType
) {
  switch (enquiryType) {
    case "sell":
      return "Tell us about the property you want to sell...";

    case "build":
      return "Tell us about your building or development project...";

    case "invest":
      return "Tell us what kind of investment you're looking for...";

    case "buy":
      return "Tell us what kind of property you're looking for...";

    default:
      return "Tell MAYVEE what you want to achieve...";
  }
}

export default function ChatPage() {
  const [searchParams] = useSearchParams();

  const intent = searchParams.get("intent");
  const property = searchParams.get("property");
  const location = searchParams.get("location");
  const price = searchParams.get("price");

  const enquiryType =
    getEnquiryType(intent);

  const welcomeMessage = useMemo(
    () =>
      getWelcomeMessage(
        enquiryType,
        property,
        location,
        price
      ),
    [
      enquiryType,
      property,
      location,
      price,
    ]
  );

  const prefilledMessage = useMemo(
    () =>
      getPrefilledMessage(
        enquiryType,
        property,
        location,
        price
      ),
    [
      enquiryType,
      property,
      location,
      price,
    ]
  );

  const suggestions =
    getSuggestions(enquiryType);

  const guidanceText =
    getGuidanceText(enquiryType);

  const placeholder =
    getPlaceholder(enquiryType);

  const [
    conversationId,
    setConversationId,
  ] = useState<string | null>(null);

  const [
    messages,
    setMessages,
  ] = useState<UiMessage[]>([
    {
      id: "welcome",
      sender_type: "BOT",
      content: welcomeMessage,
    },
  ]);

  const [
    input,
    setInput,
  ] = useState(prefilledMessage);

  const [
    sending,
    setSending,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const bottomRef =
    useRef<HTMLDivElement>(null);

  const messagesRef =
    useRef<UiMessage[]>(messages);

  /*
   * If the visitor changes enquiry type through
   * the URL, start the relevant guided session.
   */
  useEffect(() => {
    setConversationId(null);

    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender_type: "BOT",
        content: welcomeMessage,
      },
    ]);

    setInput(prefilledMessage);
    setError(null);
  }, [
    welcomeMessage,
    prefilledMessage,
  ]);

  /*
   * Keep the latest message list available
   * during polling and automatically scroll down.
   */
  useEffect(() => {
    messagesRef.current = messages;

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [
    messages,
    sending,
  ]);

  async function ensureConversation() {
    if (conversationId) {
      return conversationId;
    }

    const conversation =
      await createConversation();

    setConversationId(
      conversation.id
    );

    return conversation.id;
  }

  function handleReset() {
    setConversationId(null);

    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender_type: "BOT",
        content: welcomeMessage,
      },
    ]);

    setInput(prefilledMessage);
    setError(null);
  }

  function handleSuggestion(
    suggestion: string
  ) {
    setInput(suggestion);
  }

  async function onSubmit(
    event?: FormEvent,
    customText?: string
  ) {
    if (event) {
      event.preventDefault();
    }

    const text =
      (customText ?? input).trim();

    if (!text || sending) {
      return;
    }

    setError(null);
    setInput("");
    setSending(true);

    const tempId =
      `local-${Date.now()}`;

    setMessages((previous) => [
      ...previous,
      {
        id: tempId,
        sender_type: "CUSTOMER",
        content: text,
      },
    ]);

    try {
      const currentConversationId =
        await ensureConversation();

      const sentMessage =
        await sendMessage(
          currentConversationId,
          text
        );

      setMessages((previous) =>
        previous.map((message) =>
          message.id === tempId
            ? {
                id: sentMessage.id,
                sender_type:
                  sentMessage.sender_type,
                content:
                  sentMessage.content,
              }
            : message
        )
      );

      await pollForBotReply(
        currentConversationId,
        sentMessage.id
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message"
      );
    } finally {
      setSending(false);
    }
  }

  async function pollForBotReply(
    currentConversationId: string,
    afterId: string
  ) {
    for (
      let attempt = 0;
      attempt < 12;
      attempt++
    ) {
      await new Promise((resolve) =>
        setTimeout(resolve, 1500)
      );

      try {
        const response =
          await getMessages(
            currentConversationId
          );

        const currentIds =
          new Set(
            messagesRef.current.map(
              (message) =>
                message.id
            )
          );

        const botMessages =
          response.items.filter(
            (message: Message) =>
              message.sender_type ===
                "BOT" &&
              message.id !==
                afterId &&
              !currentIds.has(
                message.id
              )
          );

        if (
          botMessages.length > 0
        ) {
          setMessages((previous) => {
            const knownIds =
              new Set(
                previous.map(
                  (message) =>
                    message.id
                )
              );

            const newBotMessages =
              botMessages
                .filter(
                  (message) =>
                    !knownIds.has(
                      message.id
                    )
                )
                .map(
                  (message) => ({
                    id:
                      message.id,
                    sender_type:
                      message.sender_type,
                    content:
                      message.content,
                  })
                );

            if (
              newBotMessages.length === 0
            ) {
              return previous;
            }

            return [
              ...previous,
              ...newBotMessages,
            ];
          });

          return;
        }
      } catch {
        /*
         * Ignore individual polling errors.
         * The fallback acknowledgement below
         * will still be available.
         */
      }
    }

    setMessages((previous) => {
      const hasRecentBot =
        previous.some(
          (message, index) =>
            index > 0 &&
            message.sender_type ===
              "BOT"
        );

      if (hasRecentBot) {
        return previous;
      }

      return [
        ...previous,
        {
          id: `ack-${Date.now()}`,
          sender_type: "BOT",
          content:
            "Thank you! Your requirements have been received by the MAYVEE Homes & Properties team. We'll review your request and follow up with the most suitable next steps.",
        },
      ];
    });
  }

  return (
    <>
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <div className="card chat-layout">
        {/* CHAT HEADER */}
        <div className="chat-header">
          <div className="chat-header-row">
            <div>
              <p className="chat-eyebrow">
                MAYVEE HOMES & PROPERTIES
              </p>

              <h1>
                MAYVEE Property Assistant
              </h1>

              <p>
                {guidanceText}
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="chat-reset-btn"
            >
              New Chat
            </button>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="messages">
          {messages.map(
            (message) => (
              <div
                key={message.id}
                className={`bubble ${
                  message.sender_type ===
                  "CUSTOMER"
                    ? "customer"
                    : message.sender_type ===
                      "SYSTEM"
                    ? "system"
                    : "bot"
                }`}
              >
                {message.content}
              </div>
            )
          )}

          {sending && (
            <div
              className="typing"
              aria-label="Processing"
            >
              <span />
              <span />
              <span />
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* GUIDED SUGGESTIONS */}
        {messages.length <= 1 && (
          <div className="assistant-guidance">
            <p>
              You can start with one of these:
            </p>

            <div className="assistant-suggestions">
              {suggestions.map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() =>
                      handleSuggestion(
                        suggestion
                      )
                    }
                    disabled={sending}
                  >
                    {suggestion}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* COMPOSER */}
        <form
          className="composer"
          onSubmit={onSubmit}
        >
          <input
            value={input}
            onChange={(event) =>
              setInput(
                event.target.value
              )
            }
            placeholder={placeholder}
            disabled={sending}
            autoFocus
          />

          <button
            className="btn btn-primary"
            type="submit"
            disabled={
              sending ||
              !input.trim()
            }
          >
            {sending
              ? "Processing…"
              : "Send"}
          </button>
        </form>
      </div>
    </>
  );
}