import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { useEffect, useRef } from "react";
import { Fragment } from "@/generated/prisma";
import { MessageLoading } from "./message-loading";

interface Props {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
}

export const MessagesContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
}: Props) => {
  const trpc = useTRPC();
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastAssistantMessageIdRef = useRef<string | null>(null);

  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions(
      { projectId },
      { refetchInterval: 5000 }     // TODO Temporarily live messages update
    )
  );

  
  useEffect(() => {
    const lastAssistantMessage = messages.findLast(
      (message) => message.role === "ASSISTANT" 
    );
    if (
      lastAssistantMessage?.fragment && 
      lastAssistantMessage.id !== lastAssistantMessageIdRef.current
    ) {
      setActiveFragment(lastAssistantMessage.fragment);
      lastAssistantMessageIdRef.current = lastAssistantMessage.id;
    }
  }, [messages, setActiveFragment]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const lastMessage = messages[messages.length - 1];
  const isLastMessageUser = lastMessage?.role === "USER";

  return (
    <div className="flex flex-col h-full">
      {/* Messages scrollable area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {/* <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="pt-2 pr-1"> */}
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            content={message.content}
            role={message.role}
            fragment={message.fragment}
            createdAt={message.createdAt}
            isActiveFragment={activeFragment?.id === message.fragment?.id}
            onFragmentClick={() => {
              setActiveFragment(message.fragment);
            }}
            type={message.type}
          />
        ))}
        {/* </div> */}
        {isLastMessageUser && <MessageLoading />}
        <div ref={bottomRef} />
      </div>

      {/* Input form always at bottom */}
      {/* <div className=" p-4 bg-background"> */}
      <div className="relative pt-1 p-3 ">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background pointer-events-none" />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};
