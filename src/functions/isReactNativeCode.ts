export const isReactNativeCode = (fileContent:string) => {
    return (
      fileContent.includes("react-native")
    );
  };
  