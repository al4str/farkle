import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { clsx } from "clsx";

import styles from "src/ui/AssetsImage/styles.module.css";

export type UiAssetsImageName = keyof typeof NAME_TO_URL_MAP;

const NAME_TO_URL_MAP = {
  hardcore_bad_back: "/assets/images/icons/hardcore_bad_back.webp",
  hardcore_picky_eater: "/assets/images/icons/hardcore_picky_eater.webp",
  hardcore_punchable_face: "/assets/images/icons/hardcore_punchable_face.webp",
  hardcore_shy: "/assets/images/icons/hardcore_shy.webp",
  hardcore_somnambulant: "/assets/images/icons/hardcore_somnambulant.webp",
  hardcore_sweaty: "/assets/images/icons/hardcore_sweaty.webp",
  icon_hermits: "/assets/images/icons/icon_hermits.webp",
  icon_painted_skull: "/assets/images/icons/icon_painted_skull.webp",
  icon_green_tick: "/assets/images/icons/icon_green_tick.webp",
  icon_red_cross: "/assets/images/icons/icon_red_cross.webp",
  icon_quest_item: "/assets/images/icons/icon_quest_item.webp",
  icon_groschen: "/assets/images/icons/icon_groschen.webp",
  icon_quality_1: "/assets/images/icons/icon_quality_1.webp",
  icon_quality_2: "/assets/images/icons/icon_quality_2.webp",
  icon_quality_3: "/assets/images/icons/icon_quality_3.webp",
  icon_quality_4: "/assets/images/icons/icon_quality_4.webp",
  icon_perk_point: "/assets/images/icons/icon_perk_point.webp",
  icon_payment: "/assets/images/icons/icon_payment.webp",
  icon_stolen_item: "/assets/images/icons/icon_stolen_item.webp",
  icon_shop: "/assets/images/icons/icon_shop.webp",
  icon_trigger: "/assets/images/icons/icon_trigger.webp",
  icon_clergy_red: "/assets/images/icons/icon_clergy_red.webp",
  perk_black_arts_apprentice: "/assets/images/icons/perk_black_arts_apprentice.webp",
  perk_breaking_the_law: "/assets/images/icons/perk_breaking_the_law.webp",
  perk_contemplative: "/assets/images/icons/perk_contemplative.webp",
  perk_crippling_hit: "/assets/images/icons/perk_crippling_hit.webp",
  perk_dreaded_warrior: "/assets/images/icons/perk_dreaded_warrior.webp",
  perk_feint: "/assets/images/icons/perk_feint.webp",
  perk_flower_power: "/assets/images/icons/perk_flower_power.webp",
  perk_fuck_shit_up: "/assets/images/icons/perk_fuck_shit_up.webp",
  perk_furor_teutonicus: "/assets/images/icons/perk_furor_teutonicus.webp",
  perk_ghillie_suit: "/assets/images/icons/perk_ghillie_suit.webp",
  perk_hard_to_kill: "/assets/images/icons/perk_hard_to_kill.webp",
  perk_heavy_duty: "/assets/images/icons/perk_heavy_duty.webp",
  perk_heracles: "/assets/images/icons/perk_heracles.webp",
  perk_incapable_drunk: "/assets/images/icons/perk_incapable_drunk.webp",
  perk_kaminka: "/assets/images/icons/perk_kaminka.webp",
  perk_let_em_come: "/assets/images/icons/perk_let_em_come.webp",
  perk_liberal_arts: "/assets/images/icons/perk_liberal_arts.webp",
  perk_mischief_artist: "/assets/images/icons/perk_mischief_artist.webp",
  perk_na_zdravi: "/assets/images/icons/perk_na_zdravi.webp",
  perk_navratilec: "/assets/images/icons/perk_navratilec.webp",
  perk_never_surrender: "/assets/images/icons/perk_never_surrender.webp",
  perk_nezdolny: "/assets/images/icons/perk_nezdolny.webp",
  perk_one_shot_at_glory: "/assets/images/icons/perk_one_shot_at_glory.webp",
  perk_pivoslapek: "/assets/images/icons/perk_pivoslapek.webp",
  perk_pub_brawler: "/assets/images/icons/perk_pub_brawler.webp",
  perk_ratman: "/assets/images/icons/perk_ratman.webp",
  perk_resistance: "/assets/images/icons/perk_resistance.webp",
  perk_riposte: "/assets/images/icons/perk_riposte.webp",
  perk_sandman: "/assets/images/icons/perk_sandman.webp",
  perk_secret_of_secrets: "/assets/images/icons/perk_secret_of_secrets.webp",
  perk_deft_hands: "/assets/images/icons/perk_deft_hands.webp",
  perk_dobrej_batvat_to_je_zaklad: "/assets/images/icons/perk_dobrej_batvat_to_je_zaklad.webp",
  perk_like_a_feather: "/assets/images/icons/perk_like_a_feather.webp",
  perk_lucky_day: "/assets/images/icons/perk_lucky_day.webp",
  perk_silver_tongue: "/assets/images/icons/perk_silver_tongue.webp",
  perk_smart_bootstraping: "/assets/images/icons/perk_smart_bootstraping.webp",
  perk_smelinar: "/assets/images/icons/perk_smelinar.webp",
  perk_tlama_plna_zubu: "/assets/images/icons/perk_tlama_plna_zubu.webp",
  perk_totentanz: "/assets/images/icons/perk_totentanz.webp",
  perk_townsman: "/assets/images/icons/perk_townsman.webp",
  perk_trustworthypartner: "/assets/images/icons/perk_trustworthypartner.webp",
  perk_vanguard: "/assets/images/icons/perk_vanguard.webp",
  perk_vycvicenej_pajsl: "/assets/images/icons/perk_vycvicenej_pajsl.webp",
  perk_weasel_boy: "/assets/images/icons/perk_weasel_boy.webp",
  perk_zapasnik: "/assets/images/icons/perk_zapasnik.webp",
  perk_zkusenej_kalic: "/assets/images/icons/perk_zkusenej_kalic.webp",
  perk_its_a_trap_red: "/assets/images/icons/perk_its_a_trap_red.webp",
  perk_crippling_hit_red: "/assets/images/icons/perk_crippling_hit_red.webp",
  perk_through_and_through_red: "/assets/images/icons/perk_through_and_through_red.webp",
  perk_runaway_boy_red: "/assets/images/icons/perk_runaway_boy_red.webp",
  perk_one_shot_at_glory_red: "/assets/images/icons/perk_one_shot_at_glory_red.webp",
  perk_hranicarsky_beh: "/assets/images/icons/perk_hranicarsky_beh.webp",
  perk_sympatak: "/assets/images/icons/perk_sympatak.webp",
  stats_might: "/assets/images/icons/stats_might.webp",
  stats_overeat: "/assets/images/icons/stats_overeat.webp",
  stats_romance: "/assets/images/icons/stats_romance.webp",
  stats_smelly: "/assets/images/icons/stats_smelly.webp",
  stats_visibility: "/assets/images/icons/stats_visibility.webp",
  stats_coercion: "/assets/images/icons/stats_coercion.webp",
  stats_conspicuousness: "/assets/images/icons/stats_conspicuousness.webp",
  stats_dice: "/assets/images/icons/stats_dice.webp",
  stats_domination: "/assets/images/icons/stats_domination.webp",
  stats_drinking: "/assets/images/icons/stats_drinking.webp",
  stats_drunkenness_sleepy: "/assets/images/icons/stats_drunkenness_sleepy.webp",
  stats_drunkenness: "/assets/images/icons/stats_drunkenness.webp",
  stats_fencing: "/assets/images/icons/stats_fencing.webp",
  stats_hangover: "/assets/images/icons/stats_hangover.webp",
  stats_impression: "/assets/images/icons/stats_impression.webp",
  stats_intimidation: "/assets/images/icons/stats_intimidation.webp",
  reputation_awful: "/assets/images/icons/reputation_awful.webp",
  reputation_bad: "/assets/images/icons/reputation_bad.webp",
  reputation_concerning: "/assets/images/icons/reputation_concerning.webp",
  reputation_good: "/assets/images/icons/reputation_good.webp",
  reputation_great: "/assets/images/icons/reputation_great.webp",
  reputation_neutral: "/assets/images/icons/reputation_neutral.webp",
  crime_combat_active: "/assets/images/icons/crime_combat_active.webp",
  crime_combat_passive: "/assets/images/icons/crime_combat_passive.webp",
  crime_detected: "/assets/images/icons/crime_detected.webp",
  crime_investigating: "/assets/images/icons/crime_investigating.webp",
  crime_looking: "/assets/images/icons/crime_looking.webp",
  placeholder: "/assets/images/ui/placeholder.webp",
  separator_horizontal: "/assets/images/ui/separator_horizontal.webp",
  separator_vertical: "/assets/images/ui/separator.webp",
  hourglass: "/assets/images/ui/hourglass.webp",
  scroll_thumb: "/assets/images/ui/scroll_thumb.webp",
  scroll_track: "/assets/images/ui/scroll_track.webp",
  list_caption: "/assets/images/ui/list_caption.webp",
  list_focus: "/assets/images/ui/list_focus.webp",
  list_tick: "/assets/images/ui/list_tick.webp",
  hover_bg_end: "/assets/images/ui/hover_bg_end.webp",
  hover_bg_middle: "/assets/images/ui/hover_bg_middle.webp",
  hover_bg_start: "/assets/images/ui/hover_bg_start.webp",
  arrow_down: "/assets/images/ui/arrow_down.webp",
  dialog_top: "/assets/images/ui/dialog_top.webp",
  dialog_bottom: "/assets/images/ui/dialog_bottom.webp",
  dialog_middle: "/assets/images/ui/dialog_middle.webp",
  frame_fancy: "/assets/images/ui/frame_fancy.webp",
} as const;

type Element = Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children">;

interface Props extends Element {
  shadow?: boolean;
  asset: UiAssetsImageName;
}

export function UiAssetsImage(props: Props) {
  const [local, rest] = splitProps(props, [
    "class",
    "shadow",
    "asset",
    "style",
  ]);

  return (
    <span
      {...rest}
      class={clsx(
        styles.image,
        local.shadow !== false && styles.shadow,
        local.class,
      )}
      style={{
        ...(typeof local.style === "string" ? {} : local.style),
        "background-image": `url("${NAME_TO_URL_MAP[local.asset]}")`,
      }}
    />
  );
}

export function uiAssetsImageIsNameValid(imageName?: null | string): imageName is UiAssetsImageName {
  if (imageName) {
    return Object.prototype.hasOwnProperty.call(NAME_TO_URL_MAP, imageName);
  }
  return false;
}
