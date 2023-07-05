import {
  renderWidget,
  usePlugin,
  useRunAsync,
  useSessionStorageState,
  RemId,
} from '@remnote/plugin-sdk';
import { convertContentsToFlatList, generateContents } from '../lib/utils';

export const TableOfContentsWidget = () => {
  const plugin = usePlugin();
  const [remId, _] = useSessionStorageState<RemId | undefined>('toc_currentRemId', undefined);
  const contents =
    useRunAsync(async () => {
      const rem = await plugin.rem.findOne(remId);
      if (!rem) return;

      return await generateContents(rem, plugin);
    }, [remId]) || [];

  if (contents.length === 0) {
    // TODO: spinner
    return null;
  }

  const flatContents = convertContentsToFlatList(contents);

  return (
    <nav className="rounded py-1 px-4">
      <h1 className="text-lg">Contents</h1>
      <hr className="border-gray-300" />
      <ul className="p-0 space-y-3 list-none">
        {flatContents.map((content, i) => (
          <li className={`ml-${(content.depth - 1) * 4}`}>
            <a
              key={`${content.id}_${i}`}
              href="#"
              onClick={() => console.log('onClick:', content.id, content.text)}
              className="flex text-base"
            >
              <span>{content.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

renderWidget(TableOfContentsWidget);
