import React from "react";
import { Input } from "./ui/input";
import CenterLabel from "@/components/CenterLabel";
import { FunctionParameters } from "@/lib/common";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export type EnabledConverterOptions = {
  rows?: boolean;
  tag?: boolean;
  subTag?: boolean;
  structAVarName?: boolean;
  structBVarName?: boolean;
  length?: boolean;
  UTF?: boolean;
  littleEndian?: boolean;
  urlEncode?: boolean;
};

export default function ConverterOptions({
  title,
  description,
  params,
  setParams,
  enabledOptions,
  className,
}: {
  title: string;
  description: string;
  params: FunctionParameters;
  setParams: (params: FunctionParameters) => void;
  enabledOptions?: EnabledConverterOptions;
  className?: string;
}) {
  return (
    <div
      className={
        "flex flex-col gap-8 pl-3 pt-3 content-between h-3/4 w-full md:w-1/4" +
        (className ? " " + className : "")
      }
    >
      {enabledOptions && (
        <div className="parchment flex-1 grid grid-cols-2 w-full max-w-sm place-content-start gap-1.5 p-8 pl-9 pr-9">
          <CenterLabel className="col-span-2 text-center pb-4 text-[24px] text-gray-800 font-bold">
            Parameters
          </CenterLabel>
          {enabledOptions && enabledOptions.rows && (
            <CenterLabel htmlFor="Rows">Rows</CenterLabel>
          )}
          {enabledOptions && enabledOptions.rows && (
            <Input
              className="parchment-input content-center"
              type="number"
              id="rows"
              placeholder="5"
              value={params.insertStmtRowCount}
              onChange={(e) =>
                setParams({
                  ...params,
                  insertStmtRowCount: e.target.value
                    ? parseInt(e.target.value)
                    : 0,
                })
              }
            />
          )}
          {enabledOptions && enabledOptions.tag && (
            <CenterLabel htmlFor="Tag">Tag</CenterLabel>
          )}
          {enabledOptions && enabledOptions.tag && (
            <Input
              type="text"
              className="parchment-input content-center"
              id="tag"
              placeholder="db"
              value={params.tag}
              onChange={(e) =>
                setParams({
                  ...params,
                  tag: e.target.value ? e.target.value : "",
                })
              }
            />
          )}

          {enabledOptions && enabledOptions.subTag && (
            <CenterLabel htmlFor="Sub-tag">Sub-Tag</CenterLabel>
          )}
          {enabledOptions && enabledOptions.subTag && (
            <Input
              type="text"
              className="parchment-input content-center"
              id="sub_tag"
              placeholder="column"
              value={params.subTag}
              onChange={(e) =>
                setParams({
                  ...params,
                  subTag: e.target.value ? e.target.value : "",
                })
              }
            />
          )}

          {enabledOptions && enabledOptions.structAVarName && (
            <CenterLabel htmlFor="StructAVarName">
              Struct A var name
            </CenterLabel>
          )}
          {enabledOptions && enabledOptions.structAVarName && (
            <Input
              type="text"
              className="parchment-input content-center"
              id="struct_A_var_name"
              placeholder="A"
              value={params.structAVarName}
              onChange={(e) =>
                setParams({
                  ...params,
                  structAVarName: e.target.value ? e.target.value : "",
                })
              }
            />
          )}

          {enabledOptions && enabledOptions.structBVarName && (
            <CenterLabel htmlFor="StructBVarName">
              Struct B var name
            </CenterLabel>
          )}
          {enabledOptions && enabledOptions.structBVarName && (
            <Input
              type="text"
              className="parchment-input content-center"
              id="struct_B_var_name"
              placeholder="B"
              value={params.structBVarName}
              onChange={(e) =>
                setParams({
                  ...params,
                  structBVarName: e.target.value ? e.target.value : "",
                })
              }
            />
          )}

          {enabledOptions && enabledOptions.length && (
            <CenterLabel htmlFor="Length">Length</CenterLabel>
          )}
          {enabledOptions && enabledOptions.length && (
            <Input
              type="number"
              className="parchment-input content-center"
              id="length"
              placeholder="5"
              value={params.length}
              onChange={(e) =>
                setParams({
                  ...params,
                  length: e.target.value ? parseInt(e.target.value) : 0,
                })
              }
            />
          )}
          {enabledOptions && enabledOptions.UTF && (
            <CenterLabel htmlFor="UTF">UTF Encoding</CenterLabel>
          )}
          {enabledOptions && enabledOptions.UTF && (
            <Select
              onValueChange={(value) =>
                setParams({ ...params, UTFEncoding: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="8" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="32">32</SelectItem>
              </SelectContent>
            </Select>
          )}
          {enabledOptions && enabledOptions.littleEndian && (
            <CenterLabel htmlFor="littleEndian">Little Endian</CenterLabel>
          )}
          {enabledOptions && enabledOptions.littleEndian && (
            <Checkbox
              className="mt-2.5"
              onCheckedChange={(c) =>
                setParams({
                  ...params,
                  LittleEndian: c.valueOf() ? true : false,
                })
              }
            />
          )}
          {enabledOptions && enabledOptions.urlEncode && (
            <CenterLabel htmlFor="urlEncode">URL Escape</CenterLabel>
          )}
          {enabledOptions && enabledOptions.urlEncode && (
            <Checkbox
              className="mt-2.5"
              onCheckedChange={(c) =>
                setParams({
                  ...params,
                  URLEscape: c.valueOf() ? true : false,
                })
              }
            />
          )}
        </div>
      )}
      {enabledOptions && (
        <div className="parchment flex-1 p-8 pl-9 pr-9">
          <div className="text-[24px] font-bold">{title}</div>
          <br />
          <div className="whitespace-pre-line text-spacing-1">
            {description}
          </div>
        </div>
      )}
      {!enabledOptions && (
        <div className="parchment flex-1 p-8 pl-9 pr-9 content-center">
          <div className="text-[24px] font-bold">{title}</div>
          <br />
          <div className="whitespace-pre-line text-spacing-1">
            {description}
          </div>
        </div>
      )}
    </div>
  );
}
