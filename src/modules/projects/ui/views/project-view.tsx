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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { CodeView } from "@/components/code-view";
import { FileExplorer } from "@/components/file-explorer";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code" >("preview");

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

        {/* <ResizableHandle withHandle /> */}
        <ResizableHandle className="hover:bg-primary transition-colors" />

        {/*  RIGHT PANEL — Preview area */}
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
          className="h-full gap-y-0"
          defaultValue="preview"
          value={tabState}
          onValueChange={(value) => setTabState(value as "preview" | "code")}
          >
            <div className="w-full flex items-center p-2 border-b gap-x-2">
              <TabsList className="h-8 p-0 border rounded-md">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon/><span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon/><span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                <Button asChild size="sm" variant="tertiary">
                  <Link href="/pricing">
                    <CrownIcon/> Upgrade
                  </Link>
                </Button>
              </div>
            </div>
            <TabsContent value="preview">
              {!!activeFragment && <FragmentWeb data={activeFragment}/>}
            </TabsContent>
            <TabsContent value="code" className="min-h-0">
              {/* <CodeView 
              lang="ts" 
              code="const a = 'Hello world';"
              /> */}
              {!!activeFragment?.files && (
                <FileExplorer files={activeFragment.files as {[path: string]: string}}/>
              )}
            </TabsContent>
          </Tabs>
          
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
