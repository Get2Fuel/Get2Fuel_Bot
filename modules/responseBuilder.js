import dayjs from "dayjs";
import EasyTable from "easy-table";

const responseBuilder = ({ ctx, pump }) => {
  const table = new EasyTable();
  const fuels = Object.keys(pump.fuels);
  fuels.forEach((fuel) => {
    table.cell(ctx.i18n.t("tableFuel"), ctx.i18n.t(`table${fuel}`));
    table.cell(ctx.i18n.t("tableSelf"), pump.fuels[fuel].self ?? "-");
    table.cell(ctx.i18n.t("tableServed"), pump.fuels[fuel].served ?? "-");
    table.newRow();
  });

  const response = `📍${pump.address}\n🕐${dayjs(
    dayjs(pump.lastUpdate).add(1, "hour")
  ).calendar()}\n<pre>${table.toString()}</pre>`;

  return response;
};

export default responseBuilder;
