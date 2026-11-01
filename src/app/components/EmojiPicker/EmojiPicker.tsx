import EmojiPicker,{ Categories } from "emoji-picker-react";
import { customEmojis } from "@/app/lib/emojiCustom";

type TProps = {
  selectAction: (icon: string) => void;

}
export default function ({selectAction}:TProps) {
  return <EmojiPicker

    customEmojis={customEmojis}
    colorScheme="auto"
    emojiStyle="twitter"
    previewConfig={{ showPreview: false }}
    skinTonesDisabled={true}
    columns={9}
    categories={[
      Categories.SMILEYS_PEOPLE,
      Categories.ANIMALS_NATURE,
      Categories.FOOD_DRINK,
      Categories.TRAVEL_PLACES,
      Categories.ACTIVITIES,
      Categories.OBJECTS,
      Categories.SYMBOLS,
      Categories.FLAGS,
      {category:Categories.CUSTOM, group:"custom-icons",name:"Custom icons"}
    ]}
    onEmojiClick={(emojiData) => {

      selectAction(emojiData.emoji);

    }} />
}
