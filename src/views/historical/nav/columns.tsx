import { ref } from "vue";
import { ElMessageBox } from "element-plus";
import { Switch, message } from "@pureadmin/components";
import { setWellPush } from "/@/api/well";

export function useColumns() {
  const switchLoadMap = ref({});

  const columns = ref([
    {
      label: "操作",
      width: 140,
      slot: "operation",
      fixed: "left"
    },
    {
      label: "推送状态",
      prop: "state",
      width: 100,
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
      width: 60
    },
    {
      label: "施工任务",
      prop: "task",
      width: 200,
      cellRenderer: scope => scope.row.wellName + " " + scope.row.wellType
    },
    {
      label: "作业单位",
      prop: "taskDepartment"
    },
    {
      label: "设备编号",
      prop: "plateNum"
    },
    {
      label: "作业日期",
      prop: "startTime",
      cellRenderer: scope =>
        scope.row.startTime.substring(0, 4) +
        "-" +
        scope.row.startTime.substring(4, 6) +
        "-" +
        scope.row.startTime.substring(6, 8)
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
      label: "设备所属单位",
      prop: "belongTo"
    },
    {
      label: "作业时长",
      prop: "totalMin",
      cellRenderer: scope => {
        if (scope.row.totalMin > 0)
          return (
            parseInt(scope.row.totalMin / 60) +
            " hr " +
            (scope.row.totalMin % 60) +
            " mins"
          );
        else return 0;
      }
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
        const { wellName, wellType, push } = row;
        setWellPush(wellName, wellType, push).then(({ status, data }) => {
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
