import {Component} from "react";
import {Props} from "./Sample.types.ts";

class ClassComponent extends Component<Props> {
    render() {
        const { name } = this.props;
        return <h1>Hello, { name }</h1>;
    }

    componentDidMount() {
        console.log("CC: Component mounted");
    }

    componentWillUnmount() {
        console.log("CC: Component unmounted");
    }
}

export default ClassComponent;
