import { ref } from "vue";
// import dayjs from "dayjs";
import { ElMessageBox } from "element-plus";
import { Switch, message } from "@pureadmin/components";

export function useColumns() {
  const switchLoadMap = ref({});

  const columns = ref([
    {
      type: "selection",
      width: 55,
      hide: ({ checkList }) => !checkList.includes("勾选列")
    },
    {
      label: "序号",
      type: "index",
      width: 70,
      hide: ({ checkList }) => !checkList.includes("序号列")
    },
    // {
    //   label: "用户编号",
    //   prop: "ID"
    // },
    {
      label: "登录名称",
      prop: "LoginName"
    },
    {
      label: "姓名",
      prop: "username"
    },
    {
      label: "所属单位",
      prop: "BelongTo"
      // formatter: ({ dept }) => dept.name
    },
    {
      label: "用户状态",
      prop: "state",
      cellRenderer: scope => (
        <Switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model:checked={scope.row.state}
          checkedValue={1}
          unCheckedValue={0}
          checked-children="已激活"
          un-checked-children="未激活"
          onChange={() => onChange(scope)}
        />
      )
    },
    {
      label: "联系电话",
      prop: "mobile"
    },
    {
      label: "电子邮箱",
      prop: "email"
    },
    {
      label: "当前状态",
      prop: "status",
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.status === 1 ? "success" : "danger"}
          effect="plain"
        >
          {row.status === 1 ? "在线" : "离线"}
        </el-tag>
      )
    },
    {
      label: "上线次数",
      prop: "num"
    },
    // {
    //   label: "创建时间",
    //   width: 180,
    //   prop: "createTime",
    //   formatter: ({ createTime }) =>
    //     dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    // },
    {
      label: "操作",
      fixed: "left",
      width: 200,
      slot: "operation"
    }
  ]);

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === 0 ? "停用" : "激活"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.username
      }</strong>用户吗?`,
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
        setTimeout(() => {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message.success("已成功修改用户状态");
        }, 300);
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0);
      });
  }

  return {
    columns
  };
}
