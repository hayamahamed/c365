/**
 * MDX globals registry — components available inside MDX without `import`.
 * Wired via `<Content components={components} />` in `[...slug].astro`.
 * Add new components here as you build (or install) them.
 */

import { Aside } from "./components/ui/aside";
import Render from "./components/Render.astro";
import { Card } from "./components/ui/card";
import { CardGrid } from "./components/ui/card-grid";
import { PackageManagers } from "./components/ui/package-managers";
import { Step, Steps } from "./components/ui/steps";
import { Tabs, TabItem } from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { Banner } from "./components/ui/banner";
import { LinkCard } from "./components/ui/link-card";
import { Accordion,AccordionContent,AccordionGroup,AccordionTrigger } from "./components/ui/accordion";
import { LayerCard, LayerCardContent, LayerCardHeader } from "./components/ui/layer-card";



export const components = {
  Aside,
  Card,
  CardGrid,
  PackageManagers,
  Render,
  Step,
  Steps,
  TabItem,
  Tabs,
  Button,
  Banner,
  LinkCard,
  Accordion, AccordionContent, AccordionGroup, AccordionTrigger,
  LayerCard, LayerCardContent, LayerCardHeader,
};
