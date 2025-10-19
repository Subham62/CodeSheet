"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma";
import { ProjectHeader } from "../components/project-header";
import { MessagesContainer } from "../components/messages-container";
import { FragmentWeb } from "../components/fragment-web";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);

  return (
    <div className="h-screen flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col h-full"
        >
          {/* Sticky Header */}
          <Suspense fallback={<p className="p-2">Loading project...</p>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>

          {/* Scrollable Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <Suspense fallback={<p className="p-2">Loading messages...</p>}>
              <MessagesContainer
                projectId={projectId}
                activeFragment={activeFragment}
                setActiveFragment={setActiveFragment}
              />
              {/* if we use the deeper container like MessageContainer then it will not block the entire page as useSuspenseQuery takes time and now it is separate from this page and it is visually faster not really */}
            </Suspense>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/*  RIGHT PANEL — Preview area */}
        <ResizablePanel defaultSize={65} minSize={50}>
          {/* <div className="h-full flex items-center justify-center text-muted-foreground"> */}
            {/* TODO: Preview */}
          {/* </div> */}
          {!!activeFragment && <FragmentWeb data={activeFragment}/>}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
