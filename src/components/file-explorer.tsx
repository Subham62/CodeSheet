import { Fragment, useCallback, useMemo, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { Hint } from "./hint";
import { Button } from "./ui/button";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { CodeView } from "./code-view";
import { convertFilesToTreeView } from "@/lib/utils";
import { TreeView } from "./tree-view";
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";

type FileCollection = {[path: string]: string};

function getLanguageFromExtension(filename: string): string{
    const extension = filename.split(".").pop()?.toLowerCase();
    return extension || "text";
}

interface FileBreadcrumbProps {
    filePath: string;
}

const FileBreadcrumb = ({filePath}: FileBreadcrumbProps) => {
    const pathSegments = filePath.split("/");
    const maxSegments = 4;

    const renderBreadcrumbItems =() => {
        if(pathSegments.length <= maxSegments){
            // show all segments if 4 or less
            return pathSegments.map((segment, index) => {
                const isLast = index === pathSegments.length -1;

                return(
                    <Fragment key={index}>
                        <BreadcrumbItem>
                            {isLast ? (
                                <BreadcrumbPage className="font-medium">
                                    {segment}
                                </BreadcrumbPage>
                            ) : (
                                <span className="text-muted-foreground">
                                    {segment}
                                </span>
                            )}
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator/>}
                    </Fragment>
                );
            });
        }else{
            const firstSegment = pathSegments[0];
            const lastSegment = pathSegments[pathSegments.length-1];

            return(
                <>
                    <BreadcrumbItem>
                        <span className="text-muted-foreground">
                            {firstSegment}
                        </span>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <BreadcrumbEllipsis/>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium">
                                {lastSegment}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbItem>
                </>
            );
        }
    }

    return(
        <Breadcrumb>
            <BreadcrumbList >
                {renderBreadcrumbItems()}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

interface FileExplorerProps {
    files: FileCollection;
}

export const FileExplorer = ({
    files,
}: FileExplorerProps) => {

    const [copied, setCopied] = useState(false);

    const [selectdFile, setSelectedFile] = useState<string | null>(() => {
        const fileKeys = Object.keys(files);
        return fileKeys.length > 0 ? fileKeys[0] : null;
    });

    const treeData = useMemo(() => {
        return convertFilesToTreeView(files);
    }, [files]);

    const handleFileSelect = useCallback((filePath: string) => {
        if(files[filePath]){
            setSelectedFile(filePath);
        }
    }, [files]);

    const handleCopy = useCallback(() => {
        if(selectdFile) {
            navigator.clipboard.writeText(files[selectdFile]);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    }, [selectdFile, files]);

    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
                {/* <p>: Tree view</p> */}
                <TreeView
                data={treeData}
                value={selectdFile}
                onSelect={handleFileSelect}
                />
            </ResizablePanel>
            <ResizableHandle className="hover:bg-primary transition-colors"/>
            <ResizablePanel defaultSize={70} minSize={50}>
                {selectdFile && files[selectdFile] ? (
                    <div className="h-full w-full flex flex-col">
                        <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
                            {/*  file breadcrumb */}
                            <FileBreadcrumb filePath={selectdFile}/>
                            <Hint text="Copy to clipboard" side="bottom">
                                <Button
                                variant="outline"
                                size="icon"
                                className="ml-auto"
                                onClick={handleCopy}
                                disabled={copied}
                                >
                                    {copied ? <CopyCheckIcon/> : <CopyIcon/>}
                                </Button>
                            </Hint>
                        </div>
                        {/* <p>: Code View</p> */}
                        <div className="flex-1 overflow-auto">
                            <CodeView
                            code={files[selectdFile]}
                            lang={getLanguageFromExtension(selectdFile)}
                            />
                        </div>
                    </div>
                ): (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        Select a file to view it&apos;s content
                    </div>
                )}
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}