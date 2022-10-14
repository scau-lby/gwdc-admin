import Card from "./Card.vue";
import Pie from "./Pie.vue";
import Bar from "./Bar.vue";
import { App } from "vue";

const HCard = Object.assign(Card, {
  install(app: App) {
    app.component(Card.name, Card);
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

export { HCard, HPie, HBar };
