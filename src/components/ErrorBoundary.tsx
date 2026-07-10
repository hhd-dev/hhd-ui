import { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertIcon } from "@chakra-ui/react";

type PropsType = {
  children: ReactNode;
  title?: string;
};
type StateType = {
  hasError: boolean;
  title?: string;
};

class ErrorBoundary extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = { hasError: false, title: props?.title };
  }

  static getDerivedStateFromError(error: unknown) {
    console.log(error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <Alert status="error">
          <AlertIcon />
          Error while loading {this.props.title}
        </Alert>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
