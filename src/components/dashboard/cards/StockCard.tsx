"use client";

import { Download, FileSpreadsheet } from "lucide-react";
import { useRef } from "react";
import * as XLSX from "xlsx";
import * as htmlToImage from "html-to-image";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { DownloadButtons } from "~/components/ui/DownloadButtons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

// ... rest of the code ...
