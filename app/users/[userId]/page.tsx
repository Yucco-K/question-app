'use client';

import styles from '@/app/components/Questions/QuestionDetail.module.css';
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faUserGraduate, faCrown, faAward, faChevronUp, faChevronDown, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import UserProfileImage from '@/app/components/profile/UserProfileImage';
import UserNameDisplay from '@/app/components/profile/UserNameDisplay';
import DOMPurify from 'dompurify';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Pagination from '@/app/components/ui/Pagination';
import ScrollToBottomButton from '@/app/components/ui/ScrollToBottomButton';
import { toast } from 'react-toastify';
import CurrentUserEmailDisplay from '@/app/components/profile/CurrentUserEmailDisplay';
import CurrentUserNameDisplay from '@/app/components/profile/CurrentUserNameDisplay';
import CurrentUserProfileImage from '@/app/components/profile/CurrentUserProfileImage';
import useAuth from '@/app/lib/useAuth';

interface UserData {
  profileImage?: string;
  email?: string;
  username?: string;
  user_id: string;
}

interface Question {
  user_id: string;
  category_id: string | null;
  is_draft: boolean;
  created_at: string;
  id: string;
  title: string;
  description: string;
  is_resolved: boolean;
  tags: string[];
}

interface Bookmark {
  id: string;
  title: string;
  is_resolved: boolean;
  tags: string[];
  description: string;
}

interface UserStatistics {
  bestAnswerCount: number;
  totalLikes: number;
  totalAnswers: number;
}

export default function MyPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [bookmarks, setBookmarks] = useState<{
    description(description: any): unknown;
    id: any;
    title: string | undefined;
    category_id: string | null | undefined;
    is_resolved: boolean;
    is_draft: boolean;
    tags: any;
    user_id: string;
    created_at: any;
    createAt: any;
    question_id: string
  }[]>([]);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileImage, setProfileImage] = useState('');
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { userId } = useParams() as { userId: string };
  const { session } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [userStatistics, setUserStatistics] = useState<UserStatistics>({
    bestAnswerCount: 0,
    totalLikes: 0,
    totalAnswers: 0
  });
  const [loading, setLoading] = useState(true);

  const [isPostHistoryOpen, setIsPostHistoryOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  const togglePostHistory = () => setIsPostHistoryOpen(!isPostHistoryOpen);
  const toggleBookmarks = () => setIsBookmarksOpen(!isBookmarksOpen);


  const [questionCurrentPage, setQuestionCurrentPage] = useState(1);
  const [questionTotalPages, setQuestionTotalPages] = useState(1);
  const questionsPerPage = 8;

  const [bookmarkCurrentPage, setBookmarkCurrentPage] = useState(1);
  const [bookmarkTotalPages, setBookmarkTotalPages] = useState(1);
  const bookmarksPerPage = 8;


  const paginatedQuestions = questions.slice(
    (questionCurrentPage - 1) * questionsPerPage,
    questionCurrentPage * questionsPerPage
  );

  const paginatedBookmarks = bookmarks.slice(
    (bookmarkCurrentPage - 1) * bookmarksPerPage,
    bookmarkCurrentPage * bookmarksPerPage
  );


  useEffect(() => {
    setQuestionTotalPages(Math.ceil(questions.length / questionsPerPage));
  }, [questions]);

  useEffect(() => {
    setBookmarkTotalPages(Math.ceil(bookmarks.length / bookmarksPerPage));
  }, [bookmarks]);


  const handleQuestionPageChange = (page: number) => {
    setQuestionCurrentPage(page);
  };

  const handleBookmarkPageChange = (page: number) => {
    setBookmarkCurrentPage(page);
  };


  useEffect(() => {
    const fetchProfileImage = async () => {
      if (userId) {
        try {
          setLoading(true);

          const response = await fetch(`/api/users/${userId}/profile`, {
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
            },
            cache: 'no-store',
          });

          if (response.ok) {
            const data = await response.json();
            if (data.profileImage) {
              setProfileImage(data.profileImage);
              toast.success("プロフィール画像が正常に取得されました。", {
                position: "top-center",
                autoClose: 2000,
              });
            } else {
              console.error("プロフィール画像が取得できませんでした。");
              // toast.error("プロフィール画像が取得できませんでした。", {
              //   position: "top-center",
              //   autoClose: 2000,
              // });
            }
          }
        } catch (error) {
          console.error("プロフィール画像の取得に失敗しました:", error);
          toast.error("エラーが発生しました。再度お試しください。", {
            position: "top-center",
            autoClose: 2000,
          });
        }finally{
          setLoading(false);
        }
      }
    };

    fetchProfileImage();
  }, [userId, setLoading]);


  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        cache: 'no-store',
      });

      if (!response.ok) throw new Error('ユーザー情報の取得に失敗しました');

      const data = await response.json();
      setUserData(data);
      setProfileImage(data.publicUrl);

    } catch (err) {
      console.error((err as Error).message);
      toast.error('エラーが発生しました', {
        position: "top-center",
        autoClose: 2000,
      });

    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (!session) fetchUserData();
  // }, [userId, session]);


  const fetchUserStatistics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}/statistics`);
      const data = await response.json();
      setUserStatistics({
        bestAnswerCount: data.bestAnswerCount,
        totalLikes: data.totalLikes,
        totalAnswers: data.totalAnswers,
      });

    } catch (error) {
      console.error('統計情報の取得に失敗しました:', error);
      toast.error('統計情報の取得に失敗しました', {
        position: "top-center",
        autoClose: 2000,
      });

    }finally{
      setLoading(false);
    }
  };


  const fetchPostHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}/history`);
      const data = await response.json();
      setQuestions(data.questions || []);

    } catch (error) {
      console.error('投稿履歴の取得に失敗しました:', error);
      toast.error('投稿履歴の取得に失敗しました', {
        position: "top-center",
        autoClose: 2000,
      });

    }finally{
      setLoading(false);
    }
  };


  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}/bookmarks`);
      const data = await response.json();
      setBookmarks(Array.isArray(data.bookmarks) ? data.bookmarks : []);

    } catch (error) {
      console.error('ブックマークの取得に失敗しました:', error);
      toast.error('ブックマークの取得に失敗しました', {
        position: "top-center",
        autoClose: 2000,
      });

    }finally{
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchUserData(), fetchUserStatistics(), fetchPostHistory(), fetchBookmarks()]);

      } catch (error) {
        console.error('データの取得に失敗しました:', error);
        toast.error('データの取得に失敗しました', {
          position: "top-center",
          autoClose: 2000,
        });

      }finally{
        setLoading(false);
      }
    };

    fetchAllData();
  }, [userId]);


  const handleEditClick = () => {
    router.push(`/users/${userId}/edit`);
  };


  return (

    <div className="container mx-auto p-6 z-0">
      <section className="my-8">
        <div className="p-8 bg-white rounded-md shadow-md w-full lg:w-2/3 mx-auto">
          <div className="flex justify-between mb-4">
            <p className="text-xl font-bold text-gray-500">プロフィール</p>
            <button
              className="border border-sky-700 font-bold text-blue-900 px-4 py-2 rounded-sm"
              onClick={handleEditClick}
            >
              編集
            </button>
          </div>

          <div className="flex flex-col items-center border-t border-gray-300 text-md pt-6">

            <div className="flex justify-center items-center gap-x-16 my-8">

              <CurrentUserProfileImage size={80} />

              <div className="flex flex-col ml-4">
                <div className="text-blue-900 text-center text-sm font-semibold mb-6">
                  <span className="ml-2 mr-4 whitespace-nowrap">ベストアンサー</span><br/>
                  <span className='mr-4 text-lg'>{userStatistics.bestAnswerCount}</span>
                  <FontAwesomeIcon icon={faCrown} className="text-yellow-300 text-lg" />
                </div>
                <div className="text-blue-900 text-center text-sm font-semibold mb-6">
                  <span className="ml-2 mr-10 whitespace-nowrap">いいね獲得</span><br/>
                  <span className='mr-4 text-lg'>{userStatistics.totalLikes}</span>
                  <FontAwesomeIcon icon={faThumbsUp} className="text-orange-300 text-lg" />
                </div>
                <div className="text-blue-900 text-center text-sm font-semibold">
                  <span className="ml-2 mr-14 whitespace-nowrap">総回答数</span><br/>
                  <span className='mr-4 text-lg'>{userStatistics.totalAnswers}</span>
                  <FontAwesomeIcon icon={faUserGraduate} className="text-indigo-500 text-lg" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4">
              <div className="flex items-center gap-4">
                <FontAwesomeIcon icon={faEnvelope} className="text-2xl text-blue-400" />
                <div className="text-blue-900 text-sm font-bold whitespace-nowrap">
                  <CurrentUserEmailDisplay />
                </div>
              </div>
              <div className="flex gap-x-1">
                <label className="w-16 font-bold text-blue-900 text-sm whitespace-nowrap mt-1">名前:</label>
                <div className="text-blue-900 text-lg font-bold whitespace-nowrap">
                  <CurrentUserNameDisplay />
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>


      <section className="mb-8">
        <div
          className="cursor-pointer w-full lg:w-2/3 mx-auto  border border-blue-400 bg-blue-100 text-blue-500 rounded-t-lg p-4 flex justify-between items-center"
          onClick={togglePostHistory}
        ><p className="text-md font-semibold">投稿履歴</p>
        <div className="flex justify-center">
          <h3 className="text-xl text-center my-4 mr-4 font-bold text-blue-400">質問</h3>
          <p className="ml-2 font-bold text-blue-400 my-4 mr-8">( 全 {questions.length} 件 )</p>
        </div>
        <FontAwesomeIcon
          icon={isPostHistoryOpen ? faChevronUp : faChevronDown}
          className="text-lg"
        />
        </div>

      {isPostHistoryOpen && (
        <div className="space-y-4 w-full lg:w-2/3 mx-auto">
          {paginatedQuestions.length > 0 ? (
            <>
              {paginatedQuestions.map((question) => {
                const sanitizedDescription = DOMPurify.sanitize(question.description);

                return (
                  <Card
                    key={question.id}
                    id={question.id}
                    type="questions"
                    title={question.title}
                    categoryId={question.category_id}
                    onRefresh={fetchPostHistory}
                    isResolved={question.is_resolved}
                    showReadMoreButton={false}
                    footer={
                      <a href={`/questions/${question.id}`} className="hoverScale px-2 py-1 rounded-md text-md text-semibold inline-block">
                        詳細を見る
                      </a>}
                    showMenuButton={false}
                    isDraft={question.is_draft}
                    createdAt={question.created_at}
                  >

                    {question.is_resolved && (
                      <div className="absolute top-6 right-0 font-semibold text-sm text-red-400 mb-4">
                        <FontAwesomeIcon icon={faAward} className="mr-2 text-xl text-yellow-300" />解決済み
                      </div>
                    )}

                    <div className="text-blue-900 text-sm mb-4">
                      質問ID: {question.id}
                    </div>

                    <div className="flex items-center mt-4">
                      <UserProfileImage userId={question.user_id} />
                      <div className="ml-4">
                        <UserNameDisplay userId={question.user_id} />
                        <div className="text-left text-sm mt-2">
                          {question.created_at ? new Date(question.created_at).toLocaleString('ja-JP', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          }) : '作成日登録なし'}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap mt-4">
                      {question.tags?.map((tag, index) => (
                        <span key={index} className="bg-blue-500 text-white text-sm py-1 px-4 rounded-full mr-2 mb-2">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className='my-4'>
                      <div
                        className={styles.questionBody}
                        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                      />
                    </div>

                  </Card>
                );
              })}
            </>
            ) : (
            <p className="text-blue-900 mt-4">質問がありません。</p>
          )}
          <Pagination
            currentPage={questionCurrentPage}
            totalPages={questionTotalPages}
            onPageChange={handleQuestionPageChange}
          />
          <ScrollToBottomButton isModalOpen={false} />
        </div>
      )}
    </section>

    <section className="mb-8">
      <div
        className="cursor-pointer w-full lg:w-2/3 mx-auto border border-blue-400 bg-blue-100 text-white rounded-t-lg p-4 flex justify-between items-center"
        onClick={toggleBookmarks}
      >
        <h3 className="text-xl font-bold text-center my-4 mr-8 font-bold text-blue-500">ブックマーク</h3>
        <p className="font-bold text-blue-400 my-4 mr-12">
          ( 全 {bookmarks.length} 件 )
        </p>
          <FontAwesomeIcon
            icon={isBookmarksOpen ? faChevronUp : faChevronDown}
            className="text-lg text-blue-400"
          />
        </div>

        {isBookmarksOpen && (
        <>
          <div className="space-y-4 w-full lg:w-2/3 mx-auto mt-4">
            {paginatedBookmarks.length > 0 ? (
              paginatedBookmarks.map((bookmark) => {
                const sanitizedDescription = DOMPurify.sanitize(String(bookmark.description));

                return (
                  <Card
                    key={bookmark.id}
                    id={bookmark.id}
                    title={bookmark.title}
                    categoryId={bookmark.category_id}
                    isResolved={bookmark.is_resolved}
                    isDraft={bookmark.is_draft}
                    showReadMoreButton={false}
                    showViewCount={true}
                    createdAt={bookmark.created_at}
                    footer={
                      <a
                        href={`/questions/${bookmark.id}`}
                        className="hoverScale px-2 py-1 rounded-md text-md text-semibold inline-block"
                      >
                        詳細を見る
                      </a>
                    }
                    type={'bookmarks'}
                  >

                    {bookmark.is_resolved && (
                      <div className="absolute top-6 right-0 font-semibold text-sm text-red-400 mb-4">
                        <FontAwesomeIcon icon={faAward} className="mr-2 text-xl text-yellow-300" />解決済み
                      </div>
                    )}

                    <div className="text-blue-900 text-sm mb-2">
                      質問ID: {bookmark.id}
                    </div>

                    <div className="flex items-center mt-4">
                      <UserProfileImage userId={bookmark.user_id} />
                      <div className="ml-4">
                        <UserNameDisplay userId={bookmark.user_id} />
                        <div className="text-left text-sm mt-2">
                          {bookmark.created_at
                            ? new Date(bookmark.created_at).toLocaleString('ja-JP', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })
                            : '作成日登録なし'}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap mt-4">
                      {bookmark.tags.map((tag: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined, index: Key | null | undefined) => (
                        <span
                          key={index}
                          className="bg-blue-500 text-white text-sm py-1 px-4 rounded-full mr-2 mb-2"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className='my-12'>
                      <div
                        className={styles.questionBody}
                        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                      />
                    </div>

                  </Card>
                );
              })
            ) : (
              <p className="text-blue-900">ブックマークがありません。</p>
            )}
            <Pagination
              currentPage={bookmarkCurrentPage}
              totalPages={bookmarkTotalPages}
              onPageChange={handleBookmarkPageChange}
            />
            </div>
          </>
        )}
      </section>
    </div>
  );
}