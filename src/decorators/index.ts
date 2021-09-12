import { Autowired as DCAutowired } from "./Autowired";
import { Model as DCModel } from "./Model";
import { Plugin as DCPlugin } from "./Plugin";
import { Service as DCService } from "./Service";

export const Autowired = DCAutowired;
export const Model = DCModel;
export const Service = DCService;
export const Plugin = DCPlugin;

export default {
    Autowired: DCAutowired,
    Model: DCModel,
    Plugin: DCPlugin,
    Service: DCService
};
