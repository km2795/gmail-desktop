import React from "react";
import renderer from "react-test-renderer";
import Label from "../src/components/Label";

test("should render a user label of a thread", () => {
  const tree = renderer
    .create(<Label 
      color={`white`}
      label={`Archive_Payments`}
      userLabel={true} />)
    .toJSON();
  
  expect(tree).toMatchSnapshot();
});

test("should render a system label of a thread", () => {
  const tree = renderer
    .create(<Label 
      color={`red`}
      label={`INBOX`}
      userLabel={false} />)
    .toJSON();
  
  expect(tree).toMatchSnapshot();
});
