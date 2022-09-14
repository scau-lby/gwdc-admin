import Card from "./Card.vue";
import Table1 from "./Table1.vue";
import Pie from "./Pie.vue";
import Bar from "./Bar.vue";
import { App } from "vue";

const HCard = Object.assign(Card, {
  install(app: App) {
    app.component(Card.name, Card);
  }
});
const HTable1 = Object.assign(Table1, {
  install(app: App) {
    app.component(Table1.name, Table1);
  }
});
const HPie = Object.assign(Pie, {
  install(app: App) {
    app.component(Pie.name, Pie);
  }
});
const HBar = Object.assign(Bar, {
  install(app: App) {
    app.component(Bar.name, Bar);
  }
});

export { HCard, HTable1, HPie, HBar };
