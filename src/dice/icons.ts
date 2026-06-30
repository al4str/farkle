import type { DiceName } from "src/dice/data";
import { diceGetMetaData } from "src/dice/data";

const STATS_DICE_URL = "/assets/images/icons/stats_dice.webp";

const NAME_ICON_MAP: Record<string, string> = {
  die_a: "/assets/images/dice/die_a_icon.webp",
  die_b: "/assets/images/dice/die_b_icon.webp",
  die_c: "/assets/images/dice/die_c_icon.webp",
  die_d: "/assets/images/dice/die_d_icon.webp",
  die_e: "/assets/images/dice/die_e_icon.webp",
  die_f: "/assets/images/dice/die_f_icon.webp",
  die_g: "/assets/images/dice/die_g_icon.webp",
  die_h: "/assets/images/dice/die_h_icon.webp",
  die_i: "/assets/images/dice/die_i_icon.webp",
  die_j: "/assets/images/dice/die_j_icon.webp",
  die_k: "/assets/images/dice/die_k_icon.webp",
  die_l: "/assets/images/dice/die_l_icon.webp",
  die_m: "/assets/images/dice/die_m_icon.webp",
  die_o: "/assets/images/dice/die_o_icon.webp",
  die_p: "/assets/images/dice/die_p_icon.webp",
  die_q: "/assets/images/dice/die_q_icon.webp",
  die_r: "/assets/images/dice/die_r_icon.webp",
  die_q_devil: "/assets/images/dice/die_q_devil_icon.webp",
  die_r_devil: "/assets/images/dice/die_r_devil_icon.webp",
  die_kcd: "/assets/images/dice/die_kcd_icon.webp",
  die_balatro: "/assets/images/dice/die_balatro_icon.webp",
  dieSkull: "/assets/images/dice/dieSkull_icon.webp",
  dieTeeth_a: "/assets/images/dice/dieTeeth_a_icon.webp",
  dieTeeth_b: "/assets/images/dice/dieTeeth_b_icon.webp",
  dieTeeth_c: "/assets/images/dice/dieTeeth_c_icon.webp",
  dieCursed: "/assets/images/dice/dieCursed_icon.webp",
};

export function diceIconsGetUrl(name: DiceName): string {
  const meta = diceGetMetaData(name);
  if (meta) {
    const icon = NAME_ICON_MAP[meta.iconId];
    if (icon) {
      return icon;
    }
  }
  return STATS_DICE_URL;
}
