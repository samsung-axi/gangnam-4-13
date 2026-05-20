import React from "react";
import PageTitle from "../../components/ui/PageTitle";

interface PageLayoutProps {
  title: string;
  rightElement?: React.ReactNode;
  children: React.ReactNode;
}

const PageLayout = ({ title, rightElement, children }: PageLayoutProps) => {
  return (
    <div
      className="h-full w-full flex flex-col"
      style={{
        backgroundImage:
          "linear-gradient(to top, #bdc2e8 0%, #bdc2e8 1%, #e6dee9 100%)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mx-8 h-14">
        <PageTitle title={title} rightElement={rightElement} />
      </div>

      <div className="p-6 pb-16 h-full @apply bg-bg2">
        <div className="h-full flex flex-col justify-center">{children}</div>
      </div>
    </div>
  );
};

export default PageLayout;
