interface Props {
    params: Promise<{
        projectId: string;      //  this projectId name same as folder: [projectId]
    }>
};

const Page = async ({params}: Props) => {
    const {projectId} = await params;
  return (
    <div>
        Project Id: {projectId}
    </div>
  )
}

export default Page