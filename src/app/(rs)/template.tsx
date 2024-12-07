interface TemplateProps {
  children: React.ReactNode;
}

const Template = ({ children }: TemplateProps) => {
  return <div className='animate-appear'>{children}</div>;
};

export default Template;
