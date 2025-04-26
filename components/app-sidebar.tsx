import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const items = [
  {
    title: "Converter",
    functions: [
      {
        title: "Create SQL to Insert SQL",
        url: "/converter?cfn=createsql2insertsql",
      },
      {
        title: "Create SQL to Go Struct",
        url: "/converter?cfn=createsql2gostruct",
      },
      {
        title: "Go Struct to Create SQL",
        url: "/converter?cfn=gostruct2createsql",
      },
      {
        title: "JSON Struct to Go DB Struct",
        url: "/converter?cfn=json2gostruct",
      },
      {
        title: "JS Interface to Go Struct",
        url: "/converter?cfn=jsinterface2gostruct",
      },
      {
        title: "Go assign struct A to B function",
        url: "/converter?cfn=gostruct2assignfunc",
      },
    ],
  },
  {
    title: "Generator",
    functions: [
      {
        title: "Random string",
        url: "/generator?cfn=randomstring",
      },
    ],
  },
  {
    title: "Encoder-Decoder",
    functions: [
      {
        title: "Hex representation",
        url: "/coder?cfn=hex",
      },
      {
        title: "Binary representation",
        url: "/coder?cfn=binary",
      },
      {
        title: "Escape string",
        url: "/coder?cfn=escape",
      },
    ],
  },
  {
    title: "Formatter",
    functions: [
      {
        title: "JSON Beautify",
        url: "#",
      },
      {
        title: "Number Formatter",
        url: "#",
      },
    ],
  },
  {
    title: "PDF Converter",
    functions: [
      {
        title: "Add to PDF",
        url: "/pdf?cfn=merge",
      },
      {
        title: "Convert PDF to Images",
        url: "/pdf?cfn=toPNG",
      },
      {
        title: "Convert Images to PDF",
        url: "/pdf?cfn=toPDF",
      },
      {
        title: "Remove pages from PDF",
        url: "#",
      },
    ],
  },
  {
    title: "Number converter",
    functions: [
      {
        title: "Convert from or to any base",
        url: "#",
      },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="sidebar-with-bg">
      <SidebarContent>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                  {item.title}
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.functions?.map((func) => (
                      <SidebarMenuItem key={func.title}>
                        <SidebarMenuButton asChild>
                          <Link href={func.url}>
                            <span>{func.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
