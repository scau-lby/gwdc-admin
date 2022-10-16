import { ref } from "vue";
import { ElMessageBox } from "element-plus";
import { Switch, message } from "@pureadmin/components";
import { setPush } from "/@/api/well";

export function useColumns() {
  const switchLoadMap = ref({});

  const columns = ref([
    {
      label: "操作",
      width: 120,
      slot: "operation",
      fixed: "left"
    },
    {
      label: "推送状态",
      prop: "state",
      cellRenderer: scope => (
        <Switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model:checked={scope.row.push}
          checkedValue={1}
          unCheckedValue={0}
          checked-children="已推送"
          un-checked-children="未推送"
          onChange={() => onPushToggle(scope)}
        />
      )
    },
    {
      label: "序号",
      type: "index",
      width: 120
    },
    {
      label: "作业单位",
      prop: "belongTo",
      width: 150
    },
    {
      label: "钻井公司",
      prop: "drillCompany"
    },
    {
      label: "钻井队号",
      prop: "drillTeamNo"
    },
    {
      label: "井号",
      prop: "wellName",
      width: 150
    },
    {
      label: "固井类型",
      prop: "wellType"
    },
    {
      label: "固井级别",
      prop: "wellRank"
    },
    {
      label: "当前进度",
      prop: "schedule"
    },
    {
      label: "作业设备",
      prop: "trucks"
    },
    {
      label: "施工指挥",
      prop: "commander"
    },
    {
      label: "操作人员",
      prop: "opreatePerson"
    },
    {
      label: "井队作业关键参数",
      width: 160,
      slot: "operation1",
      fixed: "right"
    }
  ]);

  function onPushToggle({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.push === 0 ? "取消推送" : "推送"
      }</strong>工程数据给<strong>DrillingAnywhere</strong>吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        const { id, push } = row;
        setPush(id, push).then(({ status, data }) => {
          if (status === 200) {
            setTimeout(() => {
              switchLoadMap.value[index] = Object.assign(
                {},
                switchLoadMap.value[index],
                {
                  loading: false
                }
              );
              message.success("已成功修改数据推送状态");
            }, 300);
          } else {
            message.error(`${data}`);
            row.push === 0 ? (row.push = 1) : (row.push = 0);
          }
        });
      })
      .catch(() => {
        row.push === 0 ? (row.push = 1) : (row.push = 0);
      });
  }

  return {
    columns
  };
}
