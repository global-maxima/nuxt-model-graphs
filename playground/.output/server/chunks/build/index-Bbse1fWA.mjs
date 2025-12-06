import { defineComponent, ref, mergeProps, unref, computed, createVNode, resolveDynamicComponent, resolveComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderVNode } from 'vue/server-renderer';

const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "LineGraph",
  __ssrInlineRender: true,
  props: {
    model: {},
    series: {}
  },
  setup(__props) {
    const props = __props;
    const chartOptions = computed(() => ({
      tooltip: {},
      xAxis: {
        type: "category",
        data: props.series[0]?.data.map((point) => point.x)
      },
      yAxis: {
        type: "value"
      },
      series: props.series.map((s) => ({
        type: "line",
        name: s.label,
        data: s.data.map((p) => p.y)
      }))
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VChart = resolveComponent("VChart");
      _push(ssrRenderComponent(_component_VChart, mergeProps({
        option: chartOptions.value,
        autoresize: "",
        style: { "width": "100%", "height": "100%" }
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../src/runtime/components/graphs/LineGraph.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const LineGraph = Object.assign(_sfc_main$4, { __name: "LineGraph" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "BarGraph",
  __ssrInlineRender: true,
  props: {
    model: {},
    series: {}
  },
  setup(__props) {
    const props = __props;
    const chartOptions = computed(() => ({
      tooltip: {},
      xAxis: {
        type: "category",
        data: props.series[0]?.data.map((point) => point.x)
      },
      yAxis: {
        type: "value"
      },
      series: props.series.map((s) => ({
        type: "bar",
        name: s.label,
        data: s.data.map((p) => p.y)
      }))
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VChart = resolveComponent("VChart");
      _push(ssrRenderComponent(_component_VChart, mergeProps({
        option: chartOptions.value,
        autoresize: "",
        style: { "width": "100%", "height": "100%" }
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../src/runtime/components/graphs/BarGraph.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const BarGraph = Object.assign(_sfc_main$3, { __name: "BarGraph" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ScatterPlot",
  __ssrInlineRender: true,
  props: {
    model: {},
    series: {}
  },
  setup(__props) {
    const props = __props;
    const isNumericXAxis = computed(
      () => props.series.every(
        (s) => s.data.every((p) => typeof p.x === "number" || Number.isFinite(Number(p.x)))
      )
    );
    const categoryValues = computed(() => {
      if (isNumericXAxis.value) return [];
      const values = /* @__PURE__ */ new Set();
      props.series.forEach((s) => {
        s.data.forEach((p) => values.add(String(p.x)));
      });
      return Array.from(values);
    });
    const chartOptions = computed(() => {
      const useCategory = !isNumericXAxis.value;
      return {
        tooltip: {},
        xAxis: useCategory ? { type: "category", data: categoryValues.value } : { type: "value" },
        yAxis: { type: "value" },
        series: props.series.map((s) => ({
          type: "scatter",
          name: s.label,
          data: s.data.map((p) => [
            useCategory ? String(p.x) : Number(p.x),
            p.y
          ])
        }))
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VChart = resolveComponent("VChart");
      _push(ssrRenderComponent(_component_VChart, mergeProps({
        option: chartOptions.value,
        autoresize: "",
        style: { "width": "100%", "height": "100%" }
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../src/runtime/components/graphs/ScatterPlot.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const ScatterPlot = Object.assign(_sfc_main$2, { __name: "ScatterPlot" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ModelGraphRenderer",
  __ssrInlineRender: true,
  props: {
    model: {},
    series: {},
    type: {}
  },
  setup(__props) {
    const props = __props;
    const GraphComponent = computed(() => {
      switch (props.type) {
        case "lineGraph":
          return LineGraph;
        case "verticalBarGraph":
          return BarGraph;
        case "scatterPlot":
          return ScatterPlot;
        default:
          return LineGraph;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(GraphComponent.value), mergeProps({
        model: __props.model,
        series: __props.series
      }, _attrs), null), _parent);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../src/runtime/components/graphs/ModelGraphRenderer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ModelGraphRenderer = Object.assign(_sfc_main$1, { __name: "ModelGraphRenderer" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const model = {
      measures: [],
      // WeeklyMeasureId[]
      xAxis: "scheduleWeek",
      // satisfies Dimension
      yAxis: "observationWeek"
    };
    const points = [
      { x: "Jan", y: 10 },
      { x: "Feb", y: 18 },
      { x: "Mar", y: 25 },
      { x: "Apr", y: 15 },
      { x: "May", y: 30 }
    ];
    const series = ref([
      {
        id: "series-a",
        label: "Series A",
        data: points
      },
      {
        id: "series-b",
        label: "Series B",
        data: points.map((p) => ({ x: p.x, y: p.y * 0.7 }))
      }
    ]);
    const graphTypes = [
      { label: "Line", value: "lineGraph" },
      { label: "Vertical Bars", value: "verticalBarGraph" },
      { label: "Scatter", value: "scatterPlot" }
    ];
    const selectedType = ref("lineGraph");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col items-center gap-8 p-8 bg-slate-950 text-slate-100" }, _attrs))}><header class="max-w-3xl w-full flex flex-col gap-2"><h1 class="text-2xl font-semibold">nuxt-model-graphs playground</h1><p class="text-sm text-slate-400"> Switch graph types to verify the module wiring, ECharts plugin, and shared types. </p></header><section class="max-w-3xl w-full flex flex-col gap-4"><div class="flex items-center gap-3"><span class="text-sm text-slate-300">Graph type:</span><div class="inline-flex rounded border border-slate-700 overflow-hidden"><!--[-->`);
      ssrRenderList(graphTypes, (t) => {
        _push(`<button class="${ssrRenderClass([unref(selectedType) === t.value ? "bg-slate-200 text-slate-900" : "bg-slate-900 text-slate-300 hover:bg-slate-800", "px-3 py-1.5 text-xs transition-colors"])}">${ssrInterpolate(t.label)}</button>`);
      });
      _push(`<!--]--></div></div>`);
      _push(ssrRenderComponent(ModelGraphRenderer, {
        style: { "height": "300px" },
        model,
        series: unref(series),
        type: unref(selectedType)
      }, null, _parent));
      _push(`</section><section class="max-w-3xl w-full text-xs text-slate-500"><p> Data: months on X axis, numeric values on Y axis. If you see all three modes render and tooltips work, the module and plugins are correctly wired. </p></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Bbse1fWA.mjs.map
